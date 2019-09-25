const mailer = require('nodemailer');
const Constants = require('../utils/constants');

const { mailUser, mailPassword } = Constants;

exports.mailIt = (mail) => {
  const smtp = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: mailUser,
      pass: mailPassword,
    },
  });

  smtp.sendMail(mail);
};
