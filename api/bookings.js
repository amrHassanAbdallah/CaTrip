const {validationResult} = require('express-validator');
const prisma = require('../config/database');
const {Book, Cancel} = require("../business/bookings");
const {MyCustomError} = require("../business/types");

// Booking a car
exports.bookCar = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {carId, userId, startDate, endDate} = req.body;

    let createdBooking;
    try {
        // Check if the car is available
        createdBooking = await Book({carId, userId, startDate, endDate})

        return res.status(200).json(createdBooking);
    } catch (error) {
        if (error instanceof MyCustomError) {
            return res.status(error.statusCode).json({error: error.message});

        } else {
            console.error(error);
            return res.status(500).json({error: 'Internal server error.'});
        }

    }
};

// Canceling a booking
exports.cancelBooking = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {bookingId} = req.params;

    try {
        // Fetch the booking record
        await Cancel({bookingId})

        return res.status(204).json({});
    } catch (error) {
        if (error instanceof MyCustomError) {
            return res.status(error.statusCode).json({error: error.message});

        } else {
            console.error(error);
            return res.status(500).json({error: 'Internal server error.'});
        }
    }
};
