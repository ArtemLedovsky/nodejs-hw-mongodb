import createHttpError from 'http-errors';

export const errorHandler = (error, req, res, next) => {
  if (createHttpError.isHttpError(error)) {
    return res.status(error.status).send({
      status: error.status,
      message: error.message,
    });
  }

  res.status(500).send({
    status: 500,
    message: 'Something went wrong',
    data: error.message,
  });
};
