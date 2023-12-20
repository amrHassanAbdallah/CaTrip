/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: API operations for managing car listings
 *
 */
/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API operations for managing bookings listings
 *
 */
const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const carRoutes = require('./cars');
const bookingsRoutes = require('./bookings');
const swaggerSpec = require('../swaggerSpec');
const loggerMiddleware = require('./middlewares/logger');
const logger = require('../config/logger');

module.exports = (app) => {
  const carRouter = express.Router();

  // Apply middleware at the router level
  carRouter.use(loggerMiddleware);
  carRouter.use(cors());

  carRouter.use('/cars', carRoutes);
  carRouter.use('/bookings', bookingsRoutes);
  app.use(express.json());
  app.use('/api/v1', carRouter);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/v1', (err, req, res) => {
    logger.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
};
