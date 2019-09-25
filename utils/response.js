
function failure(res, moduleId) {
  if (!moduleId) throw new Error('Missing moduleId!!!!!');

  return function (status, message = '', success = false) {
    if (!status) throw new Error('Missing status!!!!!');

    message = message || 'OOPS!!! something went wrong!';

    res.status(status);

    res.json({
      success,
      message,
      error: message,
    });
  };
}

function success(res) {
  return function (status, result = '') {
    if (!status) throw new Error('Missing status!!!!!');

    res.status(status);

    res.json({
      success: true,
      result,
    });
  };
}

module.exports = {
  failure,
  success,
};
