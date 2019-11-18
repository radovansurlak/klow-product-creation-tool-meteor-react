/* eslint-disable func-names */
import { request, GraphQLClient } from 'graphql-request';
import { Meteor } from 'meteor/meteor';

import base64 from '/imports/helpers/base64';

const { SHOPIFY_API_KEY, SHOPIFY_API_PASS, SHOPIFY_STORE_NAME } = Meteor.settings.public;

Meteor.methods({
  async createMetafieldData({ productHandle, metafieldValueString }) {
    const authorizationString = base64(`${SHOPIFY_API_KEY}:${SHOPIFY_API_PASS}`);

    const client = new GraphQLClient(`https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2019-10/graphql.json`, {
      credentials: 'include',
      mode: 'cors',
      headers: {
        Authorization: `Basic ${authorizationString}`,
      },
    });

    const productIdQuery = `{
        productByHandle(handle: "${productHandle}") {
          id
        }
      }`;

    let productId;
    let productData;

    try {
      productData = await client.request(productIdQuery);
    } catch (error) {
      throw new Meteor.Error('error requesting product ID query', null, { error, productHandle });
    }

    if (productData.productByHandle && productData.productByHandle.id) {
      productId = productData.productByHandle.id;
    } else {
      return new Meteor.Error('product ID undefined', null, { productData, productHandle });
    }

    const metafieldMutationQuery = `mutation {
        productUpdate(input: {metafields: {namespace: "certifications", key: "certifications", value: "${metafieldValueString}", valueType: STRING}, id: "${productId}"}) {
          product {
            title
          }
          userErrors {
            field
            message
          }
        }
      }`;

    try {
      return await client.request(metafieldMutationQuery);
    } catch (error) {
      throw new Meteor.Error('error running metafield mutation query', null, { error, productHandle });
    }
  },
});
