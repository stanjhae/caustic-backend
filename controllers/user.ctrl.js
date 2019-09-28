/** */
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mailer = require('../utils/mail');
const files = require('../utils/files');
const response = require('../utils/response');
const http = require('../utils/HttpStats');
const auth = require('../utils/authToken');
const query = require('../utils/query');

const moduleId = '/api/users/';

module.exports = {
  createUser: async (req, res) => {
    const img = req.files ? req.files[0] : null;
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = req.body.provider === 'facebook' ? ['firstName', 'lastName', 'email', 'username', 'provider'] : ['firstName', 'lastName', 'email', 'username', 'password', 'provider'];

    try {
      const userr = await User.findOne({ email: req.body.email }, query.user).exec();

      if (userr) {
        if (req.body.provider === 'facebook') {
          req.body.new = true;
          await module.exports.login(req, res);
          return respond(http.OK, req.user);
        }
        return respondErr(http.FORBIDDEN, 'Email already in use');
      }

      let user = new User();

      props.forEach((prop) => { user[prop] = req.body[prop]; });

      if (img) {
        const result = await files.uploadImage(img);
        user.avatar = result._id;
      }

      if (req.body.provider === 'facebook') {
        user.hasPassword = false;
      }
      user.token = await auth.createToken(user);
      user = await user.save();
      respond(http.CREATED, user);
    } catch (err) {
      if (err.code === 11000) return respondErr(http.CONFLICT, 'Username already in use');
      respondErr(http.SERVER_ERROR, err.message);
    }
  },

  login: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const fail = () => respondErr(http.UNAUTHORIZED, 'username or password incorrect');
    const {
      email, password, provider,
    } = req.body;
    try {
      const user = await User.findOne({ email }, query.user).exec();
      if (!user) return fail();
      if (!user.hasPassword && req.body.provider !== 'facebook') {
        return respondErr(http.CONFLICT, 'Facebook account. Please use forgot password to set a password');
      }
      if (provider !== 'facebook') {
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return fail();
      }

      user.token = await auth.createToken(user);
      // user.device = device;
      await user.save();

      user.password = '';

      if (req.body.new) {
        req.user = user;
        return true;
      }
      return respond(http.OK, user);
    } catch (err) {
      console.log(err);
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },

  updateUser: async (req, res) => {
    const img = req.files ? req.files[0] : null;
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const props = [
      'firstName',
      'lastName',
      'username',
      'description',
    ];

    try {
      const { user } = req;
      if (!user) {
        return respondErr(http.FORBIDDEN, 'User not found');
      }

      props.forEach((prop) => {
        const propArr = prop.split('.');
        if (propArr.length === 1 && req.body[propArr[0]] !== undefined && req.body[propArr[0]] !== '') {
          user[propArr[0]] = req.body[propArr[0]].toString().trim();
        } else if (propArr.length === 2 && req.body[propArr[0]][propArr[1]] !== null && req.body[propArr[0]][propArr[1]] !== '') {
          user[propArr[0]][propArr[1]] = req.body[propArr[0]][propArr[1]].toString().trim();
        }
      });

      if (img) {
        console.log(img);
        const result = await files.uploadImage(img);
        user.avatar = result._id;
      }
      await user.save();
      respond(http.CREATED, user);
    } catch (err) {
      if (err.code === 11000) return respondErr(http.FORBIDDEN, 'Username already in use');
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },

  changePassword: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);
    const fail = () => respondErr(http.UNAUTHORIZED, 'Invalid Password');

    const { user } = req;
    try {
      if (req.body.password) {
        const validPass = await bcrypt.compare(req.body.password, user.password);

        if (!validPass) return fail();

        user.password = req.body.newPassword;
      } else {
        user.password = req.body.newPassword;
      }

      await user.save();
      user.password = '';
      respond(http.CREATED, '');
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },

  sendToken: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);

    try {
      const { user } = req;

      if (!user) {
        return respondErr(http.FORBIDDEN, 'User not found');
      }
      const token = `${Math.floor(1000 + Math.random() * 9000)}${new Date().getUTCMinutes()}`;

      user.verToken = token;
      user.save();

      const mail = {
        from: '"NSAD" <update@nsad.com>',
        to: user.email,
        subject: req.body.subject,
        html: `<div>
                    <strong>Hello ${user.firstName} ${user.lastName}</strong>
                    <p>This is your token: ${token}</p>
               </div>`,
      };

      mailer.mailIt(mail);

      respond(http.CREATED, '');
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },

  verifyToken: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);

    try {
      const { user } = req;
      const initTime = user.verToken.substring(4, 6);
      const userTime = req.body.code.substring(4, 6);

      if (userTime - initTime > 2) {
        return respondErr(http.FORBIDDEN, 'Token has expired');
      }

      if (req.body.code !== user.verToken) {
        return respondErr(http.FORBIDDEN, 'Token is not correct');
      }

      user.verToken = '';
      user.save();

      respond(http.CREATED, '');
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },

  getUser: async (req, res) => {
    const respond = response.success(res);
    // let pusher  = pushNotification.pushNotification(res);
    const respondErr = response.failure(res, moduleId);

    try {
      const user = await User.findById(req.params.user).populate('savedTrips').populate('savedItems').exec();
      if (!user) {
        return respondErr(http.NOT_FOUND, 'No user like that braaa');
      }
      respond(http.OK, user);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },

  getMe: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);

    try {
      const { user } = req;
      if (!user) {
        return respondErr(http.NOT_FOUND, '');
      }
      respond(http.OK, user);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },

  getUsers: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);

    try {
      const user = await User.find().exec();
      if (!user) {
        return respondErr(http.NOT_FOUND, '');
      }
      respond(http.OK, user);
    } catch (err) {
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },

  deleteUser: async (req, res) => {
    const respond = response.success(res);
    const respondErr = response.failure(res, moduleId);

    const { user } = req;
    try {
      if (user.captain || user.player) {
        return respondErr(http.CONFLICT, 'Captains and players cannot delete account');
      }
      await User.findOneAndDelete({ _id: user._id }).exec();
      respond(http.OK, {});
    } catch (err) {
      console.log(err);
      respondErr(http.SERVER_ERROR, err.message, err);
    }
  },
};
