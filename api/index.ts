import * as express from 'express';

import Logger from './utils/Logger';
import * as config from '../config/main';
import routes from './routes';

const logger = new Logger();

const server = express();

/**********************************************************
*                         Routes                          *
**********************************************************/
server.use('/', routes);

server.listen(config.apiPort, (err) => {
  if (err) {
    logger.error('Failed to start the api server.', err);
  } else {
    logger.info(
      `Running ${config.env} API server, listening at http://${config.apiHost}:${config.apiPort}\n`,
    );
  }
});

export default server;
