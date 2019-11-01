/* eslint-disable func-names */
import { request, GraphQLClient } from 'graphql-request';
import { Meteor } from 'meteor/meteor';

const { SHOPIFY_API_KEY, SHOPIFY_API_PASS } = Meteor.settings.public;

Meteor.methods({
  async getMetafieldData(productHandle) {
    function base64(str) {
      const buff = Buffer.from(str, 'utf8');
      return buff.toString('base64');
    }

    const query = `{
      productByHandle(handle: "${productHandle}") {
        title
      }
    }`;

    const authorizationString = base64(`${SHOPIFY_API_KEY}:${SHOPIFY_API_PASS}`);

    const client = new GraphQLClient('https://klow-stag.myshopify.com/admin/api/2019-10/graphql.json', {
      credentials: 'include',
      mode: 'cors',
      headers: {
        Authorization: `Basic ${authorizationString}`,
      },
    });


    try {
      const data = await client.request(query);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
});
