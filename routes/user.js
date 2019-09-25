const multer = require('multer');
const userController = require('../controllers/user.ctrl');
const auth = require('../utils/authToken');

const upload = multer({ dest: 'uploads/' });

module.exports = (router) => {
  router
    .route('/users/all')
    .get(userController.getUsers);

  router
    .route('/users/me')
    .get(auth.checkToken, userController.getMe);

  router
    .route('/users/:user')
    .get(userController.getUser);


  router
    .route('/users/register')
    .post(upload.any(), userController.createUser);

  router
    .route('/users/login')
    .post(userController.login);


  router
    .route('/users/changePassword')
    .put(auth.checkToken, userController.changePassword);

  router
    .route('/users/sendToken')
    .post(auth.checkToken, userController.sendToken);

  router
    .route('/users/verifyToken')
    .post(auth.checkToken, userController.verifyToken);

  router
    .route('/users/edit')
    .put(upload.any(), auth.checkToken, userController.updateUser);

  router
    .route('/users/delete')
    .put(auth.checkToken, userController.deleteUser);
};
