import * as chai from 'chai';
import * as Mocha from 'mocha';
import chaiHttp = require('chai-http');

import ArgsParser from './utils/ArgsParser';
import Logger from './utils/Logger';

const logger = new Logger({
  logLevel: 'verbose',
});

// use should
chai.should();
chai.use(chaiHttp);

const args = ArgsParser(process.argv);

const mocha = new Mocha({
  ui: 'bdd',
  // skip subsequent tests after one failure
  bail: true,
  // specify reporter, might use 'tap' for jenkins
  reporter: args.reporter,
  timeout: args.timeout,
});

args.tests.forEach((file) => {
  mocha.addFile(file);
});

logger.info('API tests.');
mocha.run((failures) => {
  process.exit(failures);
});
