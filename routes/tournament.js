const multer = require('multer');

const tournamentController = require('../controllers/tournament.ctrl');

const upload = require('../utils/upload').image();


module.exports = (router) => {
  router
    .route('/tournament/')
    .post(upload.fields([{ name: 'banner' }]), tournamentController.createTournament);
  router
    .route('/tournament/single/:tournament')
    .get(upload.any(), tournamentController.getTournament);
  router
    .route('/tournament/all')
    .get(tournamentController.getTournaments);
  router
    .route('/tournament/:tournament')
    .put(upload.fields([{ name: 'banner' }]), tournamentController.updateTournament);
  router
    .route('/tournament/deleteTournament/:tournament')
    .delete(tournamentController.deleteTournament);
};
