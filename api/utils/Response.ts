import Logger from './Logger';
import {
  BadRequest,
  InternalError,
  Forbidden,
  ValidationError,
} from './CustomErrors';

const logger = new Logger();

const buildSuccess = (res, data) => {
  return res.status(200).json({
    status: 200,
    message: 'Success',
    data,
  });
};

const buildInternalError = (next, err: Error) => {
  logger.error(err.message, err);

  return next(new InternalError());
};

const buildBadRequest = (next, message: string, err: Error = null) => {
  if (err) {
    logger.error(err.message, err);
  }

  return next(new BadRequest(message));
};

const buildForbidden = (next, message: string, err: Error = null) => {
  if (err) {
    logger.error(err.message, err);
  }

  return next(new Forbidden(message));
};

const buildValidationError = (next, message: string = 'You\'re not logged in.') => {
  return next(new ValidationError(message));
};

export default {
  buildSuccess,
  buildInternalError,
  buildBadRequest,
  buildForbidden,
  buildValidationError,
};
