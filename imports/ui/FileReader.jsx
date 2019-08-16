import React, { Component } from 'react';
import Papa from 'papaparse';

import {
  headerMap, valueMap, productMap, shopifyCSVHeaders,
} from '../data/dataMaps';
import brandTemplates from '../data/templates/brandTemplates';
import populateHTMLTemplate from '../data/productHTML';

class FileReader extends Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
    };
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
    const valuesOnlyData = valueTagData.map(([, value]) => value);
    const valuesString = valuesOnlyData.join(', ');
    return valuesString;
  }

  injectHTMLTemplate = (dataRow) => {
    const { getProductValues } = this;

    const productData = {};
    productData.values = getProductValues(dataRow);

    Object.entries(dataRow)
      .forEach(([property, value]) => {
        const mappedProperty = productMap.get(property);
        if (mappedProperty) {
          productData[mappedProperty] = value;
        }
      });

    const brandData = brandTemplates[productData.brand];
    const populatedHTML = populateHTMLTemplate(productData, brandData);

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

  processCSVData = (csvData) => {
    const {
      downloadCSV, injectDefaultValues, injectDefaultHeaders, injectHTMLTemplate, cleanUpCSVData,
    } = this;
    csvData.data.forEach(injectDefaultValues);
    injectDefaultHeaders(csvData);
    csvData.data.forEach(injectHTMLTemplate);
    cleanUpCSVData(csvData);

    this.setState({
      csvfile: Papa.unparse(csvData),
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

  downloadCSV() {
    const { csvfile } = this.state;
    const csv = csvfile;

    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let csvURL = null;
    if (navigator.msSaveBlob) {
      csvURL = navigator.msSaveBlob(csvData, 'download.csv');
    } else {
      csvURL = window.URL.createObjectURL(csvData);
    }

    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'download.csv');
    tempLink.click();
  }

  render() {
    return (
      <div>
        <input
          type="file"
          ref={(input) => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleUpload}
        />
      </div>
    );
  }
}

export default FileReader;
