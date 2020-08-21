import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Papa from 'papaparse';

import uuid from 'uuid/v1';

import { headerMap, valueMap, productMap } from '../data/dataMaps';

import shopifyCSVHeaders from '../data/shopifyCSVHeaders';
import populateHTMLTemplate from '../data/populateHTMLTemplate';

let brandTemplates = {};

class CSVProcessor extends Component {
  constructor() {
    super();
    this.state = {
      archivedCSVData: undefined,
      displayMetafieldButton: false,
      csvfile: undefined,
      productTypes: [
        { label: 'Marketplace', value: 'marketplace' },
        { label: 'Retail', value: 'retail' },
      ],
      selectedProductType: undefined,
      importChecked: false,
      creatingMetafields: false,
    };
  }

  async componentDidMount() {
    const response = await fetch(
      Meteor.settings.public.BRAND_TEMPLATES_SHEET_URLS,
    );
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
    this.setState(
      {
        csvfile: event.target.files[0],
      },
      importCSV,
    );
  };

  injectDefaultValues = (item) => {
    valueMap.forEach(([column, value]) => {
      item[column] = value;
    });
  };

  injectDefaultHeaders = (data) => {
    valueMap.forEach(([column]) => {
      data.meta.fields.push(column);
    });
  };

  getProductValues = (dataRow) => {
    const valueTagData = Object.entries(dataRow).filter(([tag]) =>
      tag.includes('Tag Value'),
    );
    const valuesOnlyData = valueTagData
      .map(([, value]) => value)
      .filter((tag) => tag.length !== 0);
    const valuesString = valuesOnlyData.join(', ');
    return valuesString;
  };

  injectHTMLTemplate = (dataRow) => {
    const { getProductValues } = this;
    const { selectedProductType } = this.state;

    const productData = {};

    const isMarketplaceProduct = selectedProductType === 'marketplace';

    productData.values = getProductValues(dataRow);

    Object.entries(dataRow).forEach(([property, value]) => {
      const mappedProperty = productMap.get(property);
      if (mappedProperty) {
        productData[mappedProperty] = value;
      }
    });

    const brandData = brandTemplates[productData.brand] || null;

    const populatedHTML = populateHTMLTemplate(
      productData,
      brandData,
      isMarketplaceProduct,
    );

    dataRow['Body (HTML)'] = populatedHTML;
  };

  deleteRedundantProductData = (product) => {
    Object.keys(product).forEach((property) => {
      if (!shopifyCSVHeaders.includes(property)) {
        delete product[property];
      }
    });
  };

  deleteRedundantHeaders = (data) => {
    data.meta.fields = data.meta.fields.filter((header) =>
      shopifyCSVHeaders.includes(header),
    );
  };

  cleanUpCSVData = (data) => {
    const { deleteRedundantProductData, deleteRedundantHeaders } = this;
    data.data.forEach(deleteRedundantProductData);
    deleteRedundantHeaders(data);
  };

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

    this.setState(
      {
        csvfile: Papa.unparse(csvData),
      },
      downloadCSV,
    );
  };

  importCSV = () => {
    const { processCSVData } = this;
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      header: true,
      transformHeader: (header) => {
        debugger;
        header = header.trim();
        const headerArray = Array.from(headerMap);
        const mappedHeader = headerArray.find(
          ([name]) => name.toLowerCase() === header.toLowerCase(),
        );
        // const mappedHeader = headerMap.get(header);
        return (mappedHeader && mappedHeader[1]) || header;
      },
      complete: processCSVData,
    });
  };

  handleOptionChange = (event) => {
    const { value: selectedValue } = event.target;
    this.setState(() => ({
      selectedProductType: selectedValue,
    }));
  };

  downloadCSV() {
    const { csvfile } = this.state;
    const csv = csvfile;

    const timestamp = new Date();
    const formattedDate = `${timestamp.getFullYear()}-${
      timestamp.getMonth() + 1
    }-${timestamp.getDate()}_${timestamp.getHours()}-${timestamp.getMinutes()}`;

    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let csvURL = null;
    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(
        csvData,
        `klow-creator-${formattedDate}.csv`,
      );
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
        <input
          type="radio"
          name="productType"
          id={`select-${value}`}
          checked={selectedProductType === value}
          onChange={handleOptionChange}
          value={value}
        />
        <label htmlFor={`select-${value}`}>{label}</label>
      </span>
    ));
  };

  render() {
    const { renderRadios } = this;
    const {
      selectedProductType,
      displayMetafieldButton,
      importChecked,
      creatingMetafields,
    } = this.state;

    const showMetafieldButton =
      displayMetafieldButton && importChecked && !creatingMetafields;

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
        <label htmlFor="file-upload" className="custom-file-upload">
          Upload CSV
        </label>
      </main>
    );
  }
}

export default CSVProcessor;
