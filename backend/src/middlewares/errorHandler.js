function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  console.error(err);
  let statusCode;
  let details = {};

  // resource not exist
  if (err.code == "P2003") {
    statusCode = 404;
    details = {
      success: false,
      message:
        "The related data does not exist, or it is currently referenced by other items.",
    };
  }

  // record not found
  else if (err.code == "P2025") {
    statusCode = 404;
    details = {
      success: false,
      message: "Record not found.",
    };
  }

  // wrong id
  else if (err.code == "P2023") {
    statusCode = 400;
    details = {
      success: false,
      message: "Invalid ID format.",
    };
  }

  //401
  else if (err.status == 401) {
    statusCode = 401;
    details = {
      success: false,
      message: err.message || "You are not authorized to access this page.",
    };
  }

  //403
  else if (err.status == 403) {
    statusCode = 403;
    details = {
      success: false,
      message: err.message || "You are not authorized to access this page.",
    };
  }
  //404
  else if (err.status == 404) {
    statusCode = 404;
    details = {
      success: false,
      message: err.message || "The requested page was not found.",
    };
  }
  //500
  else {
    statusCode = 500;
    details = {
      success: false,
      message:
        err.message ||
        "Something went wrong on our server. Please try again later.",
    };
  }
  res.status(statusCode);

  return res.json(details);
}

export default errorHandler;
