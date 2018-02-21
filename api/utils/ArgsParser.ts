import * as fs from 'fs';
import * as path from 'path';
import * as program from 'commander';
import * as _ from 'lodash';

import Logger from './Logger';

const testBaseDir = path.join(process.cwd(), 'api/tests');
const testExtension = 'test.ts';
const logger = new Logger();

/**
 * Ensures we have the correct args before passing back.
 *
 * @param  {Object} program the commander object.
 *
 * @return {Object}
 */
function ensureArgs(program) {

  const testName = program.test;
  const testGroup = _.toLower(program.group);
  const subTestDir = testGroup === 'all' ? '' : testGroup;
  const testDir = path.join(testBaseDir, subTestDir);

  // test if the specified folder is legit
  try {
    fs.accessSync(testDir, fs.constants.R_OK);
  } catch (err) {
    logger.error(`The specified test group folder '${subTestDir}' does not exist or is not readable.`, err);

    process.exit(1);
  }

  // generate the result
  const result = {
    timeout: _.toInteger(program.timeout),
    reporter: _.toLower(program.reporter),
    group: _.toLower(program.group),
    tests: getFileList(testDir, []).filter((file) => {

      // if a specific test is
      if (!_.isEmpty(testName)) {
        return _.last(
          _.toLower(file).split('/'),
        ).endsWith(`${_.toLower(testName)}.${testExtension}`);
      }

      return _.endsWith(file, testExtension);
    }),
  };

  /**
   * Lists all files in a dir recursively.
   *
   * @param  {String} dir the current listing dir.
   * @param  {String[]} filelist files listed so far.
   *
   * @return {String[]}
   */
  function getFileList(dir, filelist) {
    filelist = filelist || [];

    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      if (fs.statSync(dir + '/' + file).isDirectory()) {
        filelist = getFileList(dir + '/' + file, filelist);
      } else {
        filelist.push(path.resolve(dir, file));
      }
    });

    return filelist;
  }

  return result;
}

program
  .version('1.0.0')
  .usage(' -- [options]')
  .option('-t, --timeout <timeout>', 'Specify the timeout for each test, default: 10000ms', '10000')
  .option('--test <test>', 'Specify the test to run', '')
  .option('-g, --group <group>', 'Specify the test group, default: all', 'all')
  .option('-r, --reporter <reporter>', 'Specify the reporter, default: "spec"', 'spec');

program.on('--help', () => {
  logger.info('  Examples:');
  logger.info('');
  logger.info('    $ npm run test-api -- -r spec -t 999');
  logger.info('');
});

export default (argv) => {
  program.parse(argv);

  return ensureArgs(program);
};
