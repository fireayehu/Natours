const AppError = require('./../utils/appError');

exports.catchAsync = controller => {
  return (req, res, next) => {
    controller(req, res, next).catch(next);
  };
};

const developmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};
const productionError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR:: ', err);
    res.status(err.statusCode).json({
      status: err.status,
      message: 'Oops, something went wrong!'
    });
  }
};

exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    developmentError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') {
      err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
    } else if (err.code === 11000) {
      const message = err.errmsg.match(/"(.*?)"/g);
      err = new AppError(`Duplicate value ${message[0]}`, 400);
    } else if (err) {
      const message = Object.values(err.errors)
        .map(error => error.message)
        .join(', ');
      err = new AppError(`Invalid data: ${message}`, 400);
    }

    productionError(err, res);
  }

  next();
};
