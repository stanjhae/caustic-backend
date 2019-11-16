const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

AWS.config.loadFromPath('/Users/stanjhae/Desktop/caustic-backend/utils/aws.json');
const s3 = new AWS.S3();

exports.image = () => multer({
  storage: multerS3({
    s3,
    bucket: 'gsgsparta',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, { originalname }, cb) {
      cb(null, `${originalname}/${Date.now().toString()}.jpg`);
    },
  }),
});
