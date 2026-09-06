function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  
  // Log error internally on server
  console.error(`[ERROR] ${req.method} ${req.originalUrl} - Status: ${statusCode} - Message: ${err.message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Uniform JSON response shape without leaking internal stack traces
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 401 ? 'UNAUTHORIZED' : 'SERVER_ERROR'),
      message: err.message || 'An unexpected error occurred on the server.',
      details: err.details || null
    }
  });
}

module.exports = errorHandler;
