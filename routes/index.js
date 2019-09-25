const user = require('./user');
const category = require('./category');
const game = require('./game');
const tournament = require('./tournament');


module.exports = (router) => {
  user(router);
  category(router);
  game(router);
  tournament(router);
};
