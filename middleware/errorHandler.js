const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  let payload = { message: err.message, stackTrace: err.stack, status: statusCode };

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      payload.title = "Validation Failed";
      break;
    case constants.UNAUTHORIZED:
      payload.title = "Unauthorized";
      break;
    case constants.FORBIDDEN:
      payload.title = "Forbidden";
      break;
    case constants.NOT_FOUND:
      payload.title = "Not Found";
      break;
    case constants.SERVER_ERROR:
      payload.title = "Server Error";
      break;
    case 404:
      payload.title = "Not Found";
      break;
    default:
      console.log("No Error, All Good!");
      break;
  }

  // send a single JSON response
  res.status(statusCode).json(payload);
};

module.exports = { errorHandler };
