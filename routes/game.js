const gameController = require('../controllers/game.ctrl');

const upload = require('../utils/upload').image();

module.exports = (router) => {
  router
    .route('/game/')
    .post(upload.fields([{ name: 'icon' }, { name: 'banner' }]), gameController.createGame);
  router
    .route('/game/single/:game')
    .get(gameController.getGame);
  router
    .route('/game/all')
    .get(gameController.getGames);
  router
    .route('/game/:game')
    .put(upload.fields([{ name: 'icon' }, { name: 'banner' }]), gameController.updateGame);
  router
    .route('/game/deleteGame/:game')
    .delete(gameController.deleteGame);
};
