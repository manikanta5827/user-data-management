const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: 'File upload error: ' + err.message
    });
  }

  // Handle other errors
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler; 