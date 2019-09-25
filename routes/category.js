const multer = require('multer');

const categoryController = require('../controllers/category.ctrl');
// const auth = require('../utils/authToken');

const upload = multer({ dest: 'uploads/' });


module.exports = (router) => {
  router
    .route('/category/')
    .post(upload.any(), categoryController.createCategory);
  router
    .route('/category/single/:category')
    .get(upload.any(), categoryController.getCategory);
  router
    .route('/category/all')
    .get(categoryController.getCategories);
  router
    .route('/category/:category')
    .put(categoryController.updateCategory);
  router
    .route('/category/deleteCategory/:category')
    .delete(categoryController.deleteCategory);
};
