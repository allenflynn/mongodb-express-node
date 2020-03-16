module.exports = (err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack
    });
  }

  // Render
  return res.status(err.statusCode).render('error', {
    title: 'Error!',
    message: err.message
  });
};
