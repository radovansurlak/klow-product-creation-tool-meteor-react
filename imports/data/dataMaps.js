// Data mapping structure:
// [{Brand CSV column name}, {Shopify CSV column name}]

const headerMappings = [
  ['Brand', 'Vendor'],
  ['Title Name', 'Title'],
  ['Images', 'Image Src'],
  ['Product Type', 'Type'],
  ['SKU', 'Variant SKU'],
  ['TTC Price', 'Variant Price'],
  ['Barcode', 'Variant Barcode'],
  ['Inventory Quantity', 'Variant Inventory Qty'],
];

// TODO: These mappings could really use to be redesigned
const productMappings = [
  ['Cut', 'cut'],
  ['Fit', 'fit'],
  ['Color', 'color'],
  ['Material Composition', 'material'],
  ['Made In', 'madeIn'],
  ['Production Certifications', 'productionCertifications'],
  ['Material Certifications', 'materialCertifications'],
  ['Brand Certifications', 'brandCertifications'],
  ['Product Certifications', 'productCertifications'],
  ['Brand', 'values'],
  ['Vendor', 'brand'],
  ['Model Name', 'modelName'],
  ['Size Worn By Model', 'modelSizeWorn'],
  ['Model Height', 'modelHeight'],
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
