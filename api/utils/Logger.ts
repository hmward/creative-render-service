import { isEmpty, isPlainObject } from 'lodash';
import Chalk from 'chalk';
import { EventEmitter } from 'events';

type ILogLevel = 'verbose' | 'silent';
interface IConfig {
  logLevel: ILogLevel;
}

/**
 * @class
 */
export default class Logger {

  private logLevel: ILogLevel;
  private fsWriteStream: any;

  /**
   * @constructor
   *
   * @param  {IConfig} config the logger config.
   * @param  {EventEmitter} eventEmitter the event emitter to subscribe to.
   */
  constructor(config: IConfig = { logLevel: 'verbose' }, eventEmitter: EventEmitter = null) {

    /**
     * Log levels:
     *
     * silent : no logs
     * verbose : log everything
     */
    this.logLevel = config.logLevel;

    // fs write stream
    this.fsWriteStream = null;

    if (!isEmpty(eventEmitter)) {

      eventEmitter.on('info', (msg) => {
        if (this.logLevel === 'verbose') {
          this.info(msg);
        }
      });

      eventEmitter.on('error', (message, err) => {
        if (this.logLevel !== 'silent') {
          this.error(message, err);
        }
      });
    }
  }

  /**
   * @private
   * Writes messages to either file or console.
   *
   * @param  {String} ...messages the messages.
   */
  private write = (...messages) => {
    const msgString = messages.join(' ');

    // if we have a log file as output stream
    if (this.fsWriteStream) {
      this.fsWriteStream.write(msgString + '\n');
    } else {
      console.log(msgString);
    }
  }

  /**
   * @public
   * Logs the message with time.
   *
   * @param  {String} message the message.
   */
  public log = (message: string) => {
    if (!this.logLevel || this.logLevel === 'silent') {
      return;
    }

    const currentDate = new Date();
    const dateString = currentDate.toString().match(/\d\d:\d\d:\d\d/)[0];
    const preamble = Chalk.gray(`[${dateString}] `);

    this.write(preamble, message);
  }

  /**
   * @public
   * Logs info messages.
   *
   * @param  {String|Object} content the message.
   */
  public info = (content: string | object) => {
    if (isPlainObject(content)) {
      content = JSON.stringify(content);
    }

    this.log(Chalk.bold.cyan(content as string));
  }

  /**
   * @private
   * Prints the error message.
   *
   * @param  {String} message the message.
   * @param  {Error} err the error object.
   */
  public error = (message: string, err = null) => {
    this.write(Chalk.bold.red(message));

    if (this.logLevel === 'verbose' && err && err.stack) {
      this.write(Chalk.italic.gray(err.stack));
    }
  }
}
