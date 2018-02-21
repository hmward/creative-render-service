import * as fs from 'fs';
import * as path from 'path';

import S3 from './helpers/S3';

const version = require('../package.json').version;

const devFilename = 'node-widgets.umd.development.js';
const prodFilename = 'node-widgets.umd.production.js';
const libDev = fs.readFileSync(path.join(process.cwd(), 'build/lib', devFilename));
const libProd = fs.readFileSync(path.join(process.cwd(), 'build/lib/', prodFilename));

// upload to latest
S3.uploadToFolder('latest', devFilename, libDev).then(console.log).catch(console.log);
S3.uploadToFolder('latest', prodFilename, libProd).then(console.log).catch(console.log);

// upload to folder specified by version
S3.uploadToFolder(version, devFilename, libDev).then(console.log).catch(console.log);
S3.uploadToFolder(version, prodFilename, libProd).then(console.log).catch(console.log);
