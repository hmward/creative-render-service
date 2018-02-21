import * as express from 'express';
import { isEmpty } from 'lodash';

import Logger from './utils/Logger';

const router = express.Router();
const logger = new Logger();

// allow CORS
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.get('origin'));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  // TODO: investigate why sometimes CORS preflight request failed with 404
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

/********************************************************
*                      Sub Routes                       *
********************************************************/
// no sub routes

// Error handling
router.use((err, _1, res, _2) => {
  res.status(err.status || 500);
  if (!isEmpty(err.message)) {
    res.statusMessage = err.message;
  }

  if (process.env.NODE_ENV !== 'test') {
    logger.error(err.message, err);
  }

  // send back the json
  res.json(err);
});

export default router;
