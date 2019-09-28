const user = require('./user');
const category = require('./category');
const product = require('./product');


module.exports = (router) => {
  user(router);
  category(router);
  product(router);
};
