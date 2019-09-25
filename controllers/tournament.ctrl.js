const Tournament = require('../models/Tournament');
const response = require('../utils/response');
const http = require('../utils/HttpStats');

const moduleId = '/api/tournament/';

module.exports = {
  createTournament: async (req, res) => {
    const img = req.files ? req.files : null;
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = ['name'];

    try {
      let tournament = new Tournament();

      props.forEach((prop) => {
        tournament[prop] = req.body[prop];
      });
      if (img.banner && img.banner[0].fieldname === 'banner') {
        tournament.banner = img.banner[0].location;
      }

      tournament = await tournament.save();
      respond(http.CREATED, { tournament });
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  getTournament: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      const tournament = await Tournament.findById(req.params.tournament).exec();
      respond(http.OK, tournament);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  getTournaments: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      const tournaments = await Tournament.find().exec();
      respond(http.OK, tournaments);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  updateTournament: async (req, res) => {
    const img = req.files ? req.files : null;
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = ['name', 'banner', 'rules'];

    try {
      const tournament = await Tournament.findById(req.params.tournament).exec();

      if (!tournament) {
        return respondErr(http.FORBIDDEN, 'Category not found');
      }
      props.forEach((prop) => {
        const propArr = prop.split('.');
        if (propArr.length === 1 && req.body[propArr[0]] !== undefined && req.body[propArr[0]] !== '') {
          tournament[propArr[0]] = req.body[propArr[0]].toString().trim();
        } else if (propArr.length === 2 && req.body[propArr[0]][propArr[1]] !== null && req.body[propArr[0]][propArr[1]] !== '') {
          tournament[propArr[0]][propArr[1]] = req.body[propArr[0]][propArr[1]].toString().trim();
        }
      });
      if (img.banner && img.banner[0].fieldname === 'banner') {
        tournament.banner = img.banner[0].location;
      }
      await tournament.save();
      respond(http.CREATED, tournament);
    } catch (err) {
      console.log(err);
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
  deleteTournament: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    try {
      await Tournament.findOneAndDelete({ _id: req.params.tournament }).exec();
      respond(http.OK);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
};
