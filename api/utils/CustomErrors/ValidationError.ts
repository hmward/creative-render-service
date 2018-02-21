export default class ValidationError extends Error {
  protected status: number;

  constructor(message = 'Validation failed.') {
    // Calling parent constructor of base Error class.
    super();

    // Sets the error properties.
    this.name = 'ValidationError';
    this.status = 422;
    this.message = message;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, ValidationError);
  }
}
