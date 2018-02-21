import * as AWS from 'aws-sdk';
import * as Promise from 'bluebird';
import { isEmpty } from 'lodash';
import Chalk from 'chalk';

import config from './config';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
  region: config.AWS_REGION,
});

/**
 * @class
 * Helper class for S3 services.
 */
class S3 {
  private s3: AWS.S3;

  /**
   * @inheritdoc
   */
  constructor() {
    this.s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  }

  /**
   * @private
   * Uploads a file to s3, specified by folder and file name.
   *
   * @param {String} folder the specified folder.
   * @param {String} name the name of the file.
   * @param {Buffer} file the file to upload.
   */
  public uploadToFolder(folder: string, name: string, file: Buffer): Promise<AWS.S3.PutObjectOutput> {
    return new Promise((resolve, reject) => {
      if (isEmpty(folder)) {
        return reject(new Error('Folder name cannot be empty.'));
      }

      if (isEmpty(name)) {
        return reject(new Error('File name cannot be empty.'));
      }

      console.log(`Uploading file ${Chalk.bold.yellow(name)} to folder ${Chalk.bold.green(folder)}...`);
      this.upload(`${folder}/${name}`, file)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * @private
   * Uploads a file to s3 using specified key.
   *
   * @param {String} key the key of the object.
   * @param {Buffer} file the file to upload.
   */
  private upload(key: string, file: Buffer): Promise<AWS.S3.PutObjectOutput> {
    return new Promise((resolve, reject) => {
      this.s3.putObject({
        ACL: 'public-read',
        CacheControl: 'max-age=0',
        Body: file,
        Bucket: config.WIDGETS_BUCKET_NAME,
        Key: key,
      })
        .promise()
        .then(resolve)
        .catch(reject);
    });
  }
}

export default new S3();
