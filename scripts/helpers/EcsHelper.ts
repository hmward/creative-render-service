import * as AWS from 'aws-sdk';
import * as Promise from 'bluebird';
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
 * Helper class for ECS services.
 */
class EcsHelper {
  private ecs: AWS.ECS;
  private containerDefinition: AWS.ECS.ContainerDefinition;
  private imageName: string;
  private imageTag: string;

  /**
   * @inheritdoc
   */
  constructor() {
    this.ecs = new AWS.ECS({ apiVersion: '2014-11-13' });
    this.containerDefinition = {
      workingDirectory: '/src/app',
      essential: true,
      portMappings: [{
        containerPort: 8889,
        hostPort: 80,
        protocol: 'tcp',
      }],
      memoryReservation: 2000,
      environment: [],
      mountPoints: [],
      volumesFrom: [],
      cpu: 0,
    };
    this.imageName = 'nodeinc/node-widgets';
    this.imageTag = 'latest';
  }

  /**
   * @public
   * Deploy a new task using specific image.
   *
   * @param {string} tag the new image tag.
   */
  public deploy = (tag: string = 'latest') => {
    this.imageTag = tag;

    console.log(
      `Deploying ${Chalk.yellow(`${this.imageName}:${this.imageTag}`)}...`,
    );

    this.registerTaskDefinition()
      .then(this.updateService)
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * @private
   * Registers a new task.
   *
   * @return {Promise<AWS.ECS.TaskDefinition>} the registered task definition.
   */
  private registerTaskDefinition = (): Promise<AWS.ECS.TaskDefinition> => {
    return new Promise((resolve, reject) => {
      const taskFamily = 'node-widgets-task';
      console.log(`Registering new task definition of family ${Chalk.bold.yellow(taskFamily)}...`);

      this.ecs.registerTaskDefinition({
        containerDefinitions: [{
          ...this.containerDefinition,
          image: `${this.imageName}:${this.imageTag}`,
          name: 'node-widgets-container',
        }],
        family: taskFamily,
        taskRoleArn: '',
        volumes: [],
      })
        .promise()
        .then((response) => {
          console.log(`Now at revision ${Chalk.bold.green(`${response.taskDefinition.revision}`)}.`);

          return resolve(response.taskDefinition);
        })
        .catch(reject);
    });
  }

  /**
   * @private
   * Updates a service.
   *
   * @param {AWS.ECS.TaskDefinition} taskDefinition the task definition used to update the service.
   *
   * @return {Promise<AWS.ECS.Service>} the updated service info.
   */
  private updateService = (taskDefinition: AWS.ECS.TaskDefinition): Promise<AWS.ECS.Service> => {
    return new Promise((resolve, reject) => {
      const service = 'node-widgets-service';
      const cluster = 'node-explorer-widgets-cluster';

      console.log(`Updating service ${Chalk.bold.yellow(service)} in cluster ${Chalk.bold.yellow(cluster)}...`);

      this.ecs.updateService({
        service,
        cluster,
        taskDefinition: taskDefinition.taskDefinitionArn,
        desiredCount: 2,
      })
        .promise()
        .then((response) => {
          console.log(Chalk.bold.green('Service updated.'));

          return resolve(response.service);
        })
        .catch(reject);
    });
  }
}

export default new EcsHelper();
