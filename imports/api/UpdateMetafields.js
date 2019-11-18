/* eslint-disable func-names */
import { request, GraphQLClient } from 'graphql-request';
import { Meteor } from 'meteor/meteor';

const { SHOPIFY_API_KEY, SHOPIFY_API_PASS, SHOPIFY_STORE_NAME } = Meteor.settings.public;

Meteor.methods({
  async createMetafieldData(productHandle, metafieldValueString) {
    function base64(str) {
      const buff = Buffer.from(str, 'utf8');
      return buff.toString('base64');
    }

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

    let productData;

    try {
      productData = await client.request(productIdQuery);
    } catch (error) {
      return {
        success: false,
        error,
      };
    }

    const { id: productId } = productData.productByHandle;

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
      const response = await client.request(metafieldMutationQuery);
      return response;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  },
});
