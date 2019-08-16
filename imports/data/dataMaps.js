// Data mapping structure:
// [{Brand CSV column name}, {Shopify CSV column name}]

const headerMappings = [
  ['Brand', 'Vendor'],
  ['Title Name', 'Title'],
  ['Images', 'Image Src'],
  ['Product type', 'Type'],
  ['SKU', 'Variant SKU'],
  ['TTC Price', 'Variant Price'],
  ['Barcode', 'Variant Barcode'],
  ['Inventory Quantity', 'Variant Inventory Qty'],
];

// TODO: These mappings could really use to be redesigned
const productMappings = [
  ['Cut', 'cut'],
  ['Fit', 'Fit'],
  ['Option2 Value', 'color'],
  ['Composition', 'material'],
  ['Made in', 'madeIn'],
  ['Product', 'certifications'],
  ['Brand', 'values'],
  ['Vendor', 'brand'],
];

export const shopifyCSVHeaders = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Option2 Name',
  'Option2 Value',
  'Option3 Name',
  'Option3 Value',
  'Variant SKU',
  'Variant Grams',
  'Variant Barcode',
  'Variant Inventory Tracker',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
  'Variant Inventory Qty',
];

export const valueMap = [
  ['Variant Inventory Tracker', 'shopify'],
  ['Variant Inventory Policy', 'deny'],
  ['Variant Fulfillment Service', 'manual'],
  ['Published', 'FALSE'],
  ['Body (HTML)', ''],
];

export const productMap = new Map(productMappings);
export const headerMap = new Map(headerMappings);
