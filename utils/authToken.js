
const jwt = require('jsonwebtoken');

const config = require('../config');
const response = require('./response');
const http = require('./HttpStats');
const Users = require('../models/User');
const query = require('./query');


const moduleId = 'utils/authToken';

/**
 * Checks that a user has a valid token
 * i.e. is logged in
 *
 * @param req request
 * @param res response
 * @param next next middleware
 *
 * @returns {Promise.<*>}
 */
exports.checkToken = async (req, res, next) => {
  const respondErr = response.failure(res, moduleId);
  const authToken = req.get(config.AUTH_TOKEN);
  const fail = () => respondErr(http.UNAUTHORIZED, 'No user token');
  if (!req.body.email) {
    if (!authToken) return fail();

    try {
      let user = await jwt.verify(authToken, config.SECRET);
      user = await Users.findById(user._id, query.user).exec();
      if (!user) return fail();

      req.user = user;

      next();
    } catch (err) {
      respondErr(http.UNAUTHORIZED, config.AUTH_ERR_MSG, err);
    }
  } else {
    const user = await Users.findOne({ email: req.body.email }, query.user).exec();
    if (!user) {
      if (req.body.subject === 'Reset Password') {
        return respondErr(http.UNAUTHORIZED, 'User does not exist');
      }
      return fail();
    }

    req.user = user;
    next();
  }
};

exports.checkAdmin = (req, res, next) => {
  const respondErr = response.failure(res, moduleId);
  const { user } = req;

  if (!user.admin) {
    return respondErr(http.UNAUTHORIZED, config.AUTH_ERR_MSG);
  }

  next();
};

/**
 * Creates a token from a users's details
 *
 * @param user the user
 *
 * @returns {Promise.<*>}
 */
exports.createToken = async (user) => {
  const { _id, email } = user;

  return await jwt.sign({ _id, email }, config.SECRET, { expiresIn: '168h' });
};
