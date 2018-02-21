export default class BadRequest extends Error {
  protected status: number;

  constructor(message = 'Bad request.') {
    // Calling parent constructor of base Error class.
    super();

    // Sets the error properties.
    this.name = 'BadRequest';
    this.status = 400;
    this.message = message;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, BadRequest);
  }
}
