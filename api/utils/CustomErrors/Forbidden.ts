export default class Forbidden extends Error {
  protected status: number;

  constructor(message = 'Forbidden.') {
    super();

    this.name = 'Forbidden';
    this.status = 403;
    this.message = message;

    Error.captureStackTrace(this, Forbidden);
  }
}
