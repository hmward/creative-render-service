export default class InternalError extends Error {
  protected status: number;

  constructor(message = 'Internal error occurs, please contact supports.') {
    super();

    this.name = 'InternalError';
    this.status = 500;
    this.message = message;

    Error.captureStackTrace(this, InternalError);
  }
}
