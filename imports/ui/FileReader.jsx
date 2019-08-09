import React, { Component } from 'react';
import Papa from 'papaparse';

import { headerMap, valueMap, productMap } from '../data/dataMap';
import { brandTemplates } from '../data/templates/brandTemplates';

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

  createHTMLTemplate = (product) => {
    // product data are prepared
    const productData = {};
    Object.entries(product)
      .forEach(([property, value]) => {
        const mappedProperty = productMap.get(property);
        if (mappedProperty) {
          productData[mappedProperty] = value;
        }
      });
    console.log(productData);
    const brandData = brandTemplates[product.brand];
    console.log(brandData);
    // brand data are prepared
    // brand.deliveryInfo
    // brand.sizingGuide
    // brand.name
    // brand.description
    // brand.tags
  }

  importCSV = () => {
    const {
      downloadCSV, injectDefaultValues, injectDefaultHeaders, createHTMLTemplate,
    } = this;
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
      // transform: (value, header) => {
      //   console.log({ value, header });
      // },
      complete: (data) => {
        data.meta.fields = data.meta.fields.filter(field => field !== undefined);
        data.data.forEach(injectDefaultValues);
        injectDefaultHeaders(data);
        data.data.forEach(createHTMLTemplate);
        // inject default data here?
        // this.setState({
        //   csvfile: Papa.unparse(data),
        // }, downloadCSV);
      },
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
