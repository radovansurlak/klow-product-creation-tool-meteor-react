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

// function createCertificationsLine(product) {
//   const certificationKeys = [
//     'productionCertifications',
//     'materialCertifications',
//     'brandCertifications',
//     'productCertifications',
//   ];
//   const certificationStrings = [];
//   certificationKeys.forEach(
//     (key) => product[key] && certificationStrings.push(product[key]),
//   );
//   return `<li>Certifications: ${certificationStrings.join(', ')}</li>`;
// }

function populateHTMLTemplate(
  product = defaults.product,
  brand = defaults.brand,
  dropshippedProduct = true,
) {
  const lines = ['<ul>'];

  if (product.modelSizeWorn) lines.push(`<li>Le modèle porte une taille ${product.modelSizeWorn}.</li>`);
  if (product.modelHeight) lines.push(`<li>Le modèle mesure ${product.modelHeight}.</li>`);
  if (product.details) lines.push(`<li>Détails: ${product.details}</li>`);
  if (product.fitAndCut) lines.push(`<li>Fit et coupe: ${product.fitAndCut}</li>`);
  if (product.color) lines.push(`<li>Couleur: ${product.color}</li>`);
  if (product.material) lines.push(`<li>Matières: ${product.material}</li>`);
  if (product.madeIn) lines.push(`<li>Made in: ${product.madeIn}</li>`);
  if (product.certifications) lines.push(`<li>Certifications: ${product.certifications}</li>`);

  lines.push("<li>Entretien: Éviter de laver trop souvent, préférer l'aération et le pressing. Sinon lavage à froid, 20° ou 30° pour économiser un maximum l'énergie. </li>");

  lines.push('</ul>');

  return lines.join('');
}

export default populateHTMLTemplate;
