// Data mapping structure:
// [{Brand CSV column name}, {Shopify CSV column name}]

const headerMappings = [
  ['NAME', 'Title'],
  ['BRAND', 'Vendor'],
  ['PRODUCT TYPE', 'Type'],
  ['SKU', 'Variant SKU'],
  ['TTC PRICE', 'Variant Price'],
  ['SIZE', 'Option1 Value'],
  ['Color', 'Option2 Value'],
  ['BARCODE', 'Variant Barcode'],
  ['QUANTITY', 'Variant Inventory Qty'],
];

const productMappings = [
  ['Cut', 'cut'],
  ['Fit', 'fit'],
  ['Color', 'color'],
  ['Composition', 'material'],
  ['Made in', 'madeIn'],
  ['Product', 'certifications'],
  ['Brand', 'values'],
  ['Vendor', 'brand'],
];

export const shopifyCSVTemplate = [
  'Handle',
  'Title',
  'Body(HTML)',
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
  'Variant Inventory Tracker',
  'Variant Inventory Policy',
  'Variant Fulfillment Service',
  'Variant Price',
];

export const valueMap = [
  ['Option1 Name', 'Size'],
  ['Option2 Name', 'Color'],
  ['Variant Inventory Tracker', 'shopify'],
  ['Variant Inventory Policy', 'deny'],
  ['Variant Fulfillment Service', 'manual'],
  ['Published', 'FALSE'],
];

export const productMap = new Map(productMappings);
export const headerMap = new Map(headerMappings);
