function notFoundHandler(req, res, next) {
  const error = new Error("The requested endpoint or resource was not found.");
  error.status = 404;
  next(error);
}

export default notFoundHandler;
