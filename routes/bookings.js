/**
 * @openapi
 *   /api/v1/bookings:
 *     post:
 *       summary: Book a car for a specified time period
 *       tags: [Bookings]
 *       requestBody:
 *         description: Booking details
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 carId:
 *                   type: string
 *                   description: The ID of the car to be booked
 *                 userId:
 *                   type: string
 *                   description: The ID of the user making the booking
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: The start date and time of the booking
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   description: The end date and time of the booking
 *               required:
 *                 - carId
 *                 - userId
 *                 - startDate
 *                 - endDate
 *       responses:
 *         200:
 *           description: Successfully booked the car
 *           content:
 *             application/json:
 *               example:
 *                 message: 'Booking successful.'
 *         400:
 *           description: Bad request. Invalid input data or car not available.
 *           content:
 *             application/json:
 *               example:
 *                 error: 'The selected car is not available for booking.'
 *         500:
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               example:
 *                 error: 'Internal server error.'
 *
 *     delete:
 *       summary: Cancel a booking
 *       tags: [Bookings]
 *       parameters:
 *         - in: path
 *           name: bookingId
 *           schema:
 *             type: string
 *           description: The ID of the booking to be canceled
 *       responses:
 *         200:
 *           description: Successfully canceled the booking
 *           content:
 *             application/json:
 *               example:
 *                 message: 'Booking canceled successfully.'
 *         400:
 *           description: Bad request. Invalid input data or unable to cancel booking.
 *           content:
 *             application/json:
 *               example:
 *                 error: 'The booking cannot be canceled within 24 hours of the start date.'
 *         404:
 *           description: Booking not found.
 *           content:
 *             application/json:
 *               example:
 *                 error: 'Booking not found.'
 *         500:
 *           description: Internal server error.
 *           content:
 *             application/json:
 *               example:
 *                 error: 'Internal server error.'
 */

const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();
const bookingController = require('../api/bookings');

router.post('/', [
  body('carId').notEmpty().withMessage('Car ID is required').isString(),
  body('userId').notEmpty().withMessage('User ID is required').isString(),
  body('startDate').notEmpty().withMessage('Start date is required').isISO8601()
    .toDate(),
  body('endDate')
    .notEmpty().withMessage('End date is required')
    .isISO8601()
    .toDate()
    .custom((endDate, { req }) => {
      const startDate = new Date(req.body.startDate);
      if (endDate <= startDate) {
        throw new Error('End date must be after the start date');
      }
      return true;
    }),
], bookingController.bookCar);

router.delete('/:bookingId', [
  param('bookingId').notEmpty().withMessage('Booking ID is required').isString(),
], bookingController.cancelBooking);

module.exports = router;
