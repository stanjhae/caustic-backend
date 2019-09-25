const Category = require('../models/Category');
const response = require('../utils/response');
const http = require('../utils/HttpStats');

const moduleId = '/api/category/';


module.exports = {
  createCategory: async (req, res) => {
    // const img = req.files ? req.files[0] : null;
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = ['name', 'icon'];

    try {
      let category = new Category();

      props.forEach((prop) => {
        category[prop] = req.body[prop];
      });

      category = await category.save();
      respond(http.CREATED, { category });
    } catch (err) {
      console.log(err);
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  getCategory: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      const category = await Category.findById(req.params.category).populate('games').exec();
      respond(http.OK, category);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  getCategories: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      const categories = await Category.find().populate('games').exec();
      respond(http.OK, categories);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  updateCategory: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = [
      'name',
      'icon',
    ];

    try {
      const category = await Category.findById(req.params.category).exec();

      if (!category) {
        return respondErr(http.FORBIDDEN, 'Category not found');
      }
      props.forEach((prop) => {
        const propArr = prop.split('.');
        if (propArr.length === 1 && req.body[propArr[0]] !== undefined && req.body[propArr[0]] !== '') {
          category[propArr[0]] = req.body[propArr[0]].toString().trim();
        } else if (propArr.length === 2 && req.body[propArr[0]][propArr[1]] !== null && req.body[propArr[0]][propArr[1]] !== '') {
          category[propArr[0]][propArr[1]] = req.body[propArr[0]][propArr[1]].toString().trim();
        }
      });
      await category.save();
      respond(http.CREATED, category);
    } catch (err) {
      console.log(err);
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  deleteCategory: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      await Category.findOneAndDelete({ _id: req.params.category }).exec();
      respond(http.OK);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
};
