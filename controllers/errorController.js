const AppError = require("../utils/appError");

// Error handling middleware function
const handleErrors = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Send error message to the client
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

// Catch-all error handler function
const handleUnhandledErrors = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  const error = new AppError("Something went wrong!", 500);
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

module.exports = { handleErrors, handleUnhandledErrors };
