const defaults = {
  product: {
    modelName: false,
    modelSizeWorn: false,
    modelHeight: false,
    cut: false,
    fit: false,
    color: false,
    material: false,
    madeIn: false,
    productionCertifications: false,
    materialCertifications: false,
    productCertifications: false,
    brandCertifications: false,
    values: false,
    brand: false,
    description: false,
  },
  brand: {
    description: false,
    deliveryInfo: false,
    shippingLocation: false,
    sizingGuide: false,
  },
};

function createCertificationsLine(product) {
  const certificationKeys = ['productionCertifications', 'materialCertifications', 'brandCertifications', 'productCertifications'];
  const certificationStrings = [];
  certificationKeys.forEach(key => product[key] && certificationStrings.push(product[key]));
  return `<li>Certifications: ${certificationStrings.join(', ')}</li>`;
}

function populateHTMLTemplate(product = defaults.product, brand = defaults.brand, dropshippedProduct = true) {
  const lines = ['<ul>'];

  if (product.modelName && product.modelSizeWorn) {
    lines.push(`<li>The model ${product.modelName} is wearing a size ${product.modelSizeWorn}.</li>`);
  } else if (product.modelSizeWorn) {
    lines.push(`<li>The model is wearing a size ${product.modelSizeWorn}.</li>`);
  }
  if (product.cut) {
    lines.push(`<li>Cut: ${product.cut}</li>`);
  }
  if (product.fit) {
    lines.push(`<li>Fit: ${product.fit}</li>`);
  }
  if (product.color) {
    lines.push(`<li>Color: ${product.color}</li>`);
  }
  if (product.material) {
    lines.push(`<li>Material(s): ${product.material}</li>`);
  }
  if (product.madeIn) {
    lines.push(`<li>Made in: ${product.madeIn}</li>`);
  }
  lines.push('<li>Care: 30° mild fine wash, do not bleach</li>');
  lines.push(createCertificationsLine(product));

  lines.push('</ul>');

  return lines.join('');
}

export default populateHTMLTemplate;
