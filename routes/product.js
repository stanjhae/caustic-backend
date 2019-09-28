const productController = require('../controllers/product.ctrl');

const upload = require('../utils/upload').image();

module.exports = (router) => {
  router
    .route('/product/')
    .post(upload.fields([{ name: 'picture' }]), productController.createProduct);
  router
    .route('/product/single/:product')
    .get(productController.getProduct);
  router
    .route('/product/all')
    .get(productController.getProducts);
  router
    .route('/product/:product')
    .put(upload.fields([{ name: 'picture' }]), productController.updateProduct);
  router
    .route('/product/deleteProduct/:product')
    .delete(productController.deleteProduct);
};
