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
  const certificationKeys = [
    'productionCertifications',
    'materialCertifications',
    'brandCertifications',
    'productCertifications',
  ];
  const certificationStrings = [];
  certificationKeys.forEach(
    key => product[key] && certificationStrings.push(product[key]),
  );
  return `<li>Certifications: ${certificationStrings.join(', ')}</li>`;
}

function populateHTMLTemplate(
  product = defaults.product,
  brand = defaults.brand,
  dropshippedProduct = true,
) {
  const lines = ['<ul>'];

  if (product.modelName && product.modelSizeWorn) {
    lines.push(
      `<li>Le modèle ${product.modelName} porte une taille ${product.modelSizeWorn}.</li>`,
    );
  } else if (product.modelSizeWorn) {
    lines.push(
      `<li>Le modèle porte une taille ${product.modelSizeWorn}.</li>`,
    );
  }
  if (product.cut) {
    lines.push(`<li>Coupe: ${product.cut}</li>`);
  }
  if (product.fit) {
    lines.push(`<li>Fit: ${product.fit}</li>`);
  }
  if (product.color) {
    lines.push(`<li>Couleur: ${product.color}</li>`);
  }
  if (product.material) {
    lines.push(`<li>Matières: ${product.material}</li>`);
  }
  if (product.madeIn) {
    lines.push(`<li>Made in: ${product.madeIn}</li>`);
  }
  lines.push("<li>Entretien: Éviter de laver trop souvent, préférer l'aération et le pressing. Sinon lavage à froid, 20° ou 30° pour économiser un maximum l'énergie. </li>");
  lines.push(createCertificationsLine(product));

  lines.push('</ul>');

  return lines.join('');
}

export default populateHTMLTemplate;
