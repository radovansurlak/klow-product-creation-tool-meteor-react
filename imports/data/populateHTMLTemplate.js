const defaults = {
  product: {
    modelName: '***FILL IN***',
    modelSizeWorn: '***FILL IN***',
    modelHeight: '***FILL IN***',
    cut: '***FILL IN***',
    fit: '***FILL IN***',
    color: '***FILL IN***',
    material: '***FILL IN***',
    madeIn: '***FILL IN***',
    certifications: '***FILL IN***',
    values: '***FILL IN***',
    brand: '***FILL IN***',
    description: '***FILL IN***',
  },
  brand: {
    description: '***FILL IN***',
    deliveryInfo: '***FILL IN***',
    shippingLocation: '***FILL IN***',
    sizingGuide: '***FILL IN***',
  },
};


const populateHTMLTemplate = (product = defaults.product, brand = defaults.brand, dropshippedProduct = true) => `
  <ul class="accordeon_container">
  <li class="accordeon_item open">
    <div class="panel_header">Details<i class="fa fa-chevron-down"></i></div>
    <div class="panel_content">
      <!-- DÉBUT DE LA DESCRIPTION -->
            <meta charset="utf-8" />
      <p><strong>Product Details</strong></p>
      <p>On the picture, the model ${product.modelName} is wearing a size ${product.modelSizeWorn}.</p>
      <p>Model height: ${product.modelHeight}</p>
      <p></p>
      <p><strong></strong></p>
      <p><strong>Size &amp; Fit</strong></p>
      <p>Cut: ${product.cut}</p>
      <p>Fit: ${product.fit}</p>
      <p>Color: ${product.color}</p>
      <p></p>
      <p><strong>Material: </strong></p>
      <p><strong>${product.material}</strong></p>
      <p></p>
      <p><strong>Made in:</strong> ${product.madeIn}</p>
      <p></p>
      <p><strong>Take care of me</strong></p>
      <p>Care: 30° mild fine wash, Do not bleach</p>
      <p></p>
      <p class="hidden">-- FIN DE LA DESCRIPTION --</p>
    </div>
  </li>
  <ul class="accordeon_container">
    <li class="accordeon_item">
      <div class="panel_header">Values and Certifications<i class="fa fa-chevron-down"></i></div>
      <div class="panel_content">
        <p class="hidden">-- DÉBUT DE VALUES --</p>
        <meta charset="utf-8" />
        <p><strong></strong></p>
        <p><strong>Certification</strong></p>
        <p></p>
        <p>${product.certifications}</p>
        <p></p>
        <p><strong>Values</strong></p>
        <p>This product is ${product.values}</p>
        <p><strong></strong></p>
        <p class="hidden">-- FIN DE VALUES --</p>
      </div>
    </li>
    <li class="accordeon_item">
      <div class="panel_header">Brand<i class="fa fa-chevron-down"></i></div>
      <div class="panel_content">
        <p class="hidden">-- DÉBUT DE BRAND --</p>
        <p></p>
        <p><strong>${product.brand}</strong></p>
        ${brand.description}
        <p class="hidden">-- FIN DE BRAND --</p>
      </div>
    </li>
    <li class="accordeon_item">
      <div class="panel_header">Delivery<i class="fa fa-chevron-down"></i></div>
      <div class="panel_content">
        <p class="hidden">-- DÉBUT DE DELIVERY --</p>
        <meta charset="utf-8" />
        ${brand.deliveryInfo}
        <p class="hidden"></p>
        <p class="p1"></p>
        <p class="p1"><span class="s1">Free Delivery is offered for orders over 150€</span></p>
        <p class="p1"><span>The item is</span><span> shipped by </span><strong>${dropshippedProduct ? product.brand : 'Klow'}</strong><span> from ${dropshippedProduct ? brand.shippingLocation : 'Paris, France'}.</span></p>
        <p class="p2"></p>
        <p class="p2"><span class="s1"><b>DELIVERED EU COUNTRIES &amp; UNITED KINGDOM</b></span></p>
        <p class="p2"><span class="s1">${dropshippedProduct ? product.brand : 'Klow'} is only shipping to United Kingdom and to the following European countries:
    France, Monaco, Portugal, Italy, Spain, Andorra, Greece, Malta, Switzerland, Luxembourg, Belgium, Germany,
            Austria, Czech Republic, Latvia, Poland, Romania, Ireland, Denmark, Sweden, Finland and Netherland.</span>
        </p>
        <p class="p2"><span class="s1"><i>* Our Express Shipping is voluntary more expensive because it uses more carbon
      to deliver products with this method. Regarding our brand values, we decided to reduce this amont.
              However, in case you need this product as quickly as possible, we do provide this service.</i></span></p>
        <p class="hidden"><strong>Very Easy Return</strong></p>
        <p class="hidden">-- FIN DE DELIVERY --</p>
      </div>
    </li>
    <li class="accordeon_item">
      <div class="panel_header">Size Guide<i class="fa fa-chevron-down"></i></div>
      <div class="panel_content">
        <p class="hidden">-- DÉBUT DE SIZE GUIDE --</p>
        ${brand.sizingGuide}
        <p>The measurements are in centimeters</p>
        <br />
        <p class="p1"><span class="s1">You need more information about this product? Drop us an e-mail at : <a
          href="mailto:info@klow-slowfashion.com"><span class="s2">info@klow-slowfashion.com</span></a> we would be glad to answer your question.</span>
        </p>
        <p class="p1"></p>
        <p class="hidden">-- FIN DE SIZE GUIDE --</p>
      </div>
    </li>
  </ul>
</ul>
  `;

export default populateHTMLTemplate;
