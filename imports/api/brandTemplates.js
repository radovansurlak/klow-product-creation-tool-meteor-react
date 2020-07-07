/* eslint-disable import/no-unresolved */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
import axios from 'axios';
import { Meteor } from 'meteor/meteor';
import Papa from 'papaparse';
import { headerMap } from '../data/dataMaps';

Meteor.methods({
  async fetchBrandTemplates() {
    const { data: csvData } = await axios.get(
      Meteor.settings.public.BRAND_TEMPLATES_SHEET_URLS,
    );
    return new Promise((resolve) => {
      Papa.parse(csvData, {
        header: true,
        transformHeader: (header) => {
          const mappedHeader = headerMap.get(header);
          if (mappedHeader !== undefined) {
            return mappedHeader;
          }
          return header;
        },
        complete: ({ data }) => {
          const brandTemplatesCSV = data.reduce((result, item) => {
            result[item.name] = item;
            return result;
          }, {});
          resolve(brandTemplatesCSV);
        },
      });
    });
  },
});
