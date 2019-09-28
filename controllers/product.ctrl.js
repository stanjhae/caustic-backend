const Product = require('../models/Product');
const Category = require('../models/Category');
const response = require('../utils/response');
const http = require('../utils/HttpStats');

const moduleId = '/api/product/';

module.exports = {
  createProduct: async (req, res) => {
    const img = req.files ? req.files : null;
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = ['name', 'category', 'picture'];

    try {
      let product = new Product();

      props.forEach((prop) => {
        product[prop] = req.body[prop];
      });
      if (img.picture && img.picture[0].fieldname === 'picture') {
        product.picture = img.picture[0].location;
      }

      product = await product.save();
      const category = await Category.findById(req.body.category).exec();
      category.product.push(product._id);
      await category.save();
      respond(http.CREATED, { product });
    } catch (err) {
      console.log(err);
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  getProduct: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      const product = await Product.findById(req.params.product).populate('category').exec();
      respond(http.OK, product);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  getProducts: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      const products = await Product.find().populate('category').exec();
      respond(http.OK, products);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  updateProduct: async (req, res) => {
    const img = req.files ? req.files : null;
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = [
      'name',
      'picture',
      'category',
    ];
    try {
      const product = await Product.findById(req.params.product).exec();

      if (!product) {
        return respondErr(http.FORBIDDEN, 'Product not found');
      }
      props.forEach((prop) => {
        const propArr = prop.split('.');
        if (propArr.length === 1 && req.body[propArr[0]] !== undefined && req.body[propArr[0]] !== '') {
          product[propArr[0]] = req.body[propArr[0]].toString().trim();
        } else if (propArr.length === 2 && req.body[propArr[0]][propArr[1]] !== null && req.body[propArr[0]][propArr[1]] !== '') {
          product[propArr[0]][propArr[1]] = req.body[propArr[0]][propArr[1]].toString().trim();
        }
      });
      if (img.picture && img.picture[0].fieldname === 'picture') {
        product.picture = img.picture[0].location;
      }

      await product.save();
      const category = await Category.findById(req.body.category).exec();
      category.product.push(product._id);
      await category.save();

      respond(http.CREATED, product);
    } catch (err) {
      console.log(err);
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  deleteProduct: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      await Product.findOneAndDelete({ _id: req.params.product }).exec();
      respond(http.OK);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
};
