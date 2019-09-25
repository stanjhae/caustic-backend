const Game = require('../models/Game');
const Category = require('../models/Category');
const response = require('../utils/response');
const http = require('../utils/HttpStats');

const moduleId = '/api/game/';

module.exports = {
  createGame: async (req, res) => {
    const img = req.files ? req.files : null;
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = ['name', 'category'];

    try {
      let game = new Game();

      props.forEach((prop) => {
        game[prop] = req.body[prop];
      });
      if (img.icon && img.icon[0].fieldname === 'icon') {
        game.icon = img.icon[0].location;
      }
      if (img.banner && img.banner[0].fieldname === 'banner') {
        game.banner = img.banner[0].location;
      }

      game = await game.save();
      const category = await Category.findById(req.body.category).exec();
      category.games.push(game._id);
      await category.save();
      respond(http.CREATED, { game });
    } catch (err) {
      console.log(err);
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  getGame: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      const game = await Game.findById(req.params.game).populate('category').exec();
      respond(http.OK, game);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  getGames: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      const games = await Game.find().populate('category').exec();
      respond(http.OK, games);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  updateGame: async (req, res) => {
    const img = req.files ? req.files : null;
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = [
      'name',
      'icon',
      'category',
    ];
    try {
      const game = await Game.findById(req.params.game).exec();

      if (!game) {
        return respondErr(http.FORBIDDEN, 'Game not found');
      }
      props.forEach((prop) => {
        const propArr = prop.split('.');
        if (propArr.length === 1 && req.body[propArr[0]] !== undefined && req.body[propArr[0]] !== '') {
          game[propArr[0]] = req.body[propArr[0]].toString().trim();
        } else if (propArr.length === 2 && req.body[propArr[0]][propArr[1]] !== null && req.body[propArr[0]][propArr[1]] !== '') {
          game[propArr[0]][propArr[1]] = req.body[propArr[0]][propArr[1]].toString().trim();
        }
      });
      if (img.icon && img.icon[0].fieldname === 'icon') {
        game.icon = img.icon[0].location;
      }
      if (img.banner && img.banner[0].fieldname === 'banner') {
        game.banner = img.banner[0].location;
      }
      await game.save();
      const category = await Category.findById(req.body.category).exec();
      category.games.push(game._id);
      await category.save();

      respond(http.CREATED, game);
    } catch (err) {
      console.log(err);
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  deleteGame: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      await Game.findOneAndDelete({ _id: req.params.game }).exec();
      respond(http.OK);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
};
