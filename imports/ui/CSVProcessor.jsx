/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Papa from 'papaparse';

import uuid from 'uuid/v1';
import generateSlug from '../helpers/generateSlug';

import {
  headerMap, valueMap, productMap,
} from '../data/dataMaps';

import shopifyCSVHeaders from '../data/shopifyCSVHeaders';
import populateHTMLTemplate from '../data/populateHTMLTemplate';

import Loader from './Loader';

let brandTemplates;

class CSVProcessor extends Component {
  constructor() {
    super();
    this.state = {
      archivedCSVData: undefined,
      displayMetafieldButton: false,
      csvfile: undefined,
      productTypes: [{ label: 'Marketplace', value: 'marketplace' }, { label: 'Retail', value: 'retail' }],
      selectedProductType: undefined,
      importChecked: false,
      creatingMetafields: false,
    };
  }

  async componentDidMount() {
    const response = await fetch(Meteor.settings.public.BRAND_TEMPLATES_SHEET_URLS);
    const textResponse = await response.text();
    Papa.parse(textResponse, {
      header: true,
      transformHeader: (header) => {
        const mappedHeader = headerMap.get(header);
        if (mappedHeader !== undefined) {
          return mappedHeader;
        }
        return header;
      },
      complete: ({ data }) => {
        brandTemplates = data.reduce((result, item) => {
          result[item.name] = item;
          return result;
        }, {});
      },
    });
  }

  handleUpload = (event) => {
    const { importCSV } = this;
    this.setState({
      csvfile: event.target.files[0],
    }, importCSV);
  }

  injectDefaultValues = (item) => {
    valueMap.forEach(([column, value]) => {
      item[column] = value;
    });
  }

  injectDefaultHeaders = (data) => {
    valueMap.forEach(([column]) => {
      data.meta.fields.push(column);
    });
  }

  getProductValues = (dataRow) => {
    const valueTagData = Object.entries(dataRow).filter(([tag]) => tag.includes('Tag Value'));
    const valuesOnlyData = valueTagData.map(([, value]) => value).filter(tag => tag.length !== 0);
    const valuesString = valuesOnlyData.join(', ');
    return valuesString;
  }

  injectHTMLTemplate = (dataRow) => {
    const { getProductValues } = this;
    const { selectedProductType } = this.state;

    const productData = {};

    const isMarketplaceProduct = selectedProductType === 'marketplace';

    productData.values = getProductValues(dataRow);

    Object.entries(dataRow)
      .forEach(([property, value]) => {
        const mappedProperty = productMap.get(property);
        if (mappedProperty) {
          productData[mappedProperty] = value;
        }
      });

    const brandData = brandTemplates[productData.brand];

    const populatedHTML = populateHTMLTemplate(productData, brandData, isMarketplaceProduct);

    dataRow['Body (HTML)'] = populatedHTML;
  }

  deleteRedundantProductData = (product) => {
    Object.keys(product).forEach((property) => {
      if (!shopifyCSVHeaders.includes(property)) {
        delete product[property];
      }
    });
  }

  deleteRedundantHeaders = (data) => {
    data.meta.fields = data.meta.fields.filter(header => shopifyCSVHeaders.includes(header));
  }

  cleanUpCSVData = (data) => {
    const { deleteRedundantProductData, deleteRedundantHeaders } = this;
    data.data.forEach(deleteRedundantProductData);
    deleteRedundantHeaders(data);
  }

  processCertificationArray = (certificationArray) => {
    const flatCertificationArray = certificationArray.map(x => x.split(',')).flatten().map(x => x.trim());
    const filteredArray = [];
    const certificationHash = {};
    flatCertificationArray.forEach((certification) => {
      if (!certificationHash[certification.trim().toLowerCase()]) {
        filteredArray.push(certification);
        certificationHash[certification.trim().toLowerCase()] = true;
      }
    });
    return filteredArray;
  };

  createShopifyMetafield = async productData => new Promise((resolve, reject) => {
    const { processCertificationArray } = this;

    const certificationKeys = ['Production Certifications', 'Material Certifications', 'Brand Certifications', 'Product Certifications'];
    const certificationStrings = [];

    certificationKeys.forEach(key => productData[key]
      && certificationStrings.push(productData[key]));

    const processedCertificationStrings = processCertificationArray(certificationStrings);

    const metafieldValueString = processedCertificationStrings.join(', ');
    const productHandle = productData.Handle || generateSlug(productData.Title);

    Meteor.call('createMetafieldData', { productHandle, metafieldValueString }, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  })


  processCSVData = async (csvData) => {
    const {
      downloadCSV,
      injectDefaultValues,
      injectDefaultHeaders,
      injectHTMLTemplate,
      cleanUpCSVData,
    } = this;

    csvData.data.forEach(injectDefaultValues);
    injectDefaultHeaders(csvData);
    csvData.data.forEach(injectHTMLTemplate);

    this.setState(() => ({
      archivedCSVData: JSON.parse(JSON.stringify(csvData)),
    }));

    cleanUpCSVData(csvData);

    this.setState({
      csvfile: Papa.unparse(csvData),
      displayMetafieldButton: true,
    }, downloadCSV);
  }

  importCSV = () => {
    const { processCSVData } = this;
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      header: true,
      transformHeader: (header) => {
        const mappedHeader = headerMap.get(header);
        if (mappedHeader !== undefined) {
          return mappedHeader;
        }
        return header;
      },
      complete: processCSVData,
    });
  }

  handleOptionChange = (event) => {
    const { value: selectedValue } = event.target;
    this.setState(() => ({
      selectedProductType: selectedValue,
    }));
  }

  filterProductArray = (productArray) => {
    const filteredArray = [];
    const productHash = {};
    productArray.forEach((item) => {
      if (!productHash[item.Title]) {
        filteredArray.push(item);
        productHash[item.Title] = true;
      }
    });
    return filteredArray;
  }

  handleCheckboxChange = () => {
    this.setState(oldState => ({
      importChecked: !oldState.importChecked,
    }));
  }

  handleMetafieldButtonClick = async () => {
    const { archivedCSVData } = this.state;
    const { createShopifyMetafield, filterProductArray } = this;

    const filteredProductData = filterProductArray(archivedCSVData.data);

    this.setState({
      creatingMetafields: true,
    });

    for (const product of filteredProductData) {
      try {
        const result = await createShopifyMetafield(product);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({
      creatingMetafields: false,
    });

    alert('Finished creating Shopify metafields');
  }

  downloadCSV() {
    const { csvfile } = this.state;
    const csv = csvfile;

    const timestamp = new Date();
    const formattedDate = `${timestamp.getFullYear()}-${timestamp.getMonth() + 1}-${timestamp.getDate()}_${timestamp.getHours()}-${timestamp.getMinutes()}`;

    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let csvURL = null;
    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(csvData, `klow-creator-${formattedDate}.csv`);
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }

    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', `klow-creator-${formattedDate}.csv`);
    tempLink.click();
  }


  renderRadios = () => {
    const { productTypes, selectedProductType } = this.state;
    const { handleOptionChange } = this;
    return productTypes.map(({ label, value }) => (
      <span key={uuid()} className="product-type-selector">
        <input type="radio" name="productType" id={`select-${value}`} checked={selectedProductType === value} onChange={handleOptionChange} value={value} />
        <label htmlFor={`select-${value}`}>{label}</label>
      </span>
    ));
  }

  render() {
    const { renderRadios } = this;
    const {
      selectedProductType, displayMetafieldButton, importChecked, creatingMetafields,
    } = this.state;

    const showMetafieldButton = displayMetafieldButton && importChecked && !creatingMetafields;

    return (
      <main className="main-container">
        <header className="radio-section">
          <h2>Select product type</h2>
          {renderRadios()}
        </header>
        <input
          disabled={selectedProductType === undefined}
          id="file-upload"
          type="file"
          ref={(input) => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleUpload}
        />

        {!displayMetafieldButton && <label htmlFor="file-upload" className="custom-file-upload">Upload CSV</label>}
        {displayMetafieldButton && !creatingMetafields && (
        <label className="import-label">
          <input type="checkbox" className="import-checkbox" checked={importChecked} onChange={() => this.handleCheckboxChange()} />
          All products finished importing in Shopify
        </label>
        )}
        {showMetafieldButton && <button className="metafield-button" type="button" onClick={() => this.handleMetafieldButtonClick()}>Create metafields</button>}
        {creatingMetafields && <h3 className="metafields-info-header">Creating metafields...</h3> }
        {creatingMetafields && <Loader /> }
      </main>
    );
  }
}

export default CSVProcessor;
