// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.details || err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource Not Found';
  } else if (err.name === 'ConflictError') {
    statusCode = 409;
    message = 'Resource Conflict';
  } else if (err.code === 'PGRST116') {
    statusCode = 404;
    message = 'Resource Not Found';
  } else if (err.code === 'PGRST201') {
    statusCode = 400;
    message = 'Invalid Request Data';
  } else if (err.code === 'PGRST301') {
    statusCode = 409;
    message = 'Resource Already Exists';
  } else if (err.code === 'PGRST401') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.code === 'PGRST403') {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.code === 'PGRST404') {
    statusCode = 404;
    message = 'Resource Not Found';
  } else if (err.code === 'PGRST409') {
    statusCode = 409;
    message = 'Resource Conflict';
  } else if (err.code === 'PGRST500') {
    statusCode = 500;
    message = 'Database Error';
  }

  // Custom error messages
  if (err.message && !details) {
    message = err.message;
  }

  // Development vs Production error details
  if (process.env.NODE_ENV === 'development') {
    details = {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    };
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { 
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    })
  });
};

module.exports = {
  errorHandler
}; 