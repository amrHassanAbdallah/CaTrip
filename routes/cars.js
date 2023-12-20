/**
 * @openapi
 *   /api/v1/cars:
 *     post:
 *       summary: Create a new car listing
 *       tags: [Cars]
 *       requestBody:
 *         description: Car details
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 make:
 *                   type: string
 *                   description: The make of the car
 *                 model:
 *                   type: string
 *                   description: The model of the car
 *                 year:
 *                   type: integer
 *                   description: The manufacturing year of the car
 *                 mileage:
 *                   type: integer
 *                   description: The mileage of the car
 *                 price:
 *                   type: integer
 *                   description: The price of the car
 *               required:
 *                 - make
 *                 - model
 *                 - year
 *                 - mileage
 *                 - price
 *       responses:
 *         201:
 *           description: Successfully created a new car listing
 *           content:
 *             application/json:
 *               example:
 *                 id: 1
 *                 make: Toyota
 *                 model: Camry
 *                 year: 2022
 *                 mileage: 10000
 *                 price: 25000
 *                 availability: true
 *         400:
 *           description: Bad request. Invalid input data.
 *           content:
 *             application/json:
 *               example:
 *                 errors: [
 *                   {
 *                     value: '',
 *                     msg: 'Make is required',
 *                     param: 'make',
 *                     location: 'body'
 *                   },
 *                   {
 *                     value: '',
 *                     msg: 'Model is required',
 *                     param: 'model',
 *                     location: 'body'
 *                   },
 *                   // ... other validation errors
 *                 ]
 *     get:
 *       summary: Search for cars based on specified criteria
 *       tags: [Cars]
 *       parameters:
 *         - in: query
 *           name: make
 *           schema:
 *             type: string
 *           description: The make of the car
 *         - in: query
 *           name: model
 *           schema:
 *             type: string
 *           description: The model of the car
 *         - in: query
 *           name: year
 *           schema:
 *             type: integer
 *           description: The manufacturing year of the car
 *         - in: query
 *           name: mileage
 *           schema:
 *             type: integer
 *           description: The mileage of the car
 *         - in: query
 *           name: price
 *           schema:
 *             type: integer
 *           description: The price of the car
 *       responses:
 *         200:
 *           description: Successfully retrieved car listings
 *           content:
 *             application/json:
 *               example:
 *                 - id: 1
 *                   make: Toyota
 *                   model: Camry
 *                   year: 2022
 *                   mileage: 10000
 *                   price: 25000
 *                   availability: false
 */

const express = require('express');
const { body, query } = require('express-validator');

const router = express.Router();
const carController = require('../api/cars');

router.post('/', [
  body('make').notEmpty().withMessage('Make is required').isString()
    .withMessage('Make must be a string'),
  body('model').notEmpty().withMessage('Model is required').isString()
    .withMessage('Model must be a string'),
  body('year').notEmpty().withMessage('Year is required').isInt()
    .withMessage('Year must be an integer'),
  body('mileage').notEmpty().withMessage('Mileage is required').isInt()
    .withMessage('Mileage must be an integer'),
  body('price').notEmpty().withMessage('Price is required').isInt()
    .withMessage('Price must be an integer'),
], carController.createCar);

router.get('/', [
  query('make').optional().isString(),
  query('model').optional().isString(),
  query('price').optional().isInt().toInt(),
  query('year').optional().isInt().toInt(),
  query('mileage').optional().isInt().toInt(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sort').optional().isIn(['make', 'model', 'year', 'mileage', 'price'])
], carController.searchCars);

module.exports = router;
