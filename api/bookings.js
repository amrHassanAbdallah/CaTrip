const {validationResult} = require('express-validator');
const prisma = require('../config/database');

// Booking a car
exports.bookCar = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {carId, userId, startDate, endDate} = req.body;

    try {
        // Check if the car is available
        const car = await prisma.cars.findUnique({where: {id: carId}});
        if (!car || !car.isAvailable) {
            return res.status(400).json({error: 'The selected car is not available for booking.'});
        }

        // Check if the start date is at least 24 hours in the future
        const bookingStartDate = new Date(startDate);
        const currentDateTime = new Date();

        if (bookingStartDate.getTime() - currentDateTime.getTime() <= 24 * 60 * 60 * 1000) {
            return res.status(400).json({error: 'The booking start date must be at least 24 hours in the future.'});
        }

        // Start a database transaction
       let result =  await prisma.$transaction([
            // Update car availability
            prisma.cars.update({
                where: {id: carId},
                data: {isAvailable: false},
            }),
            // Create a booking record
            prisma.bookings.create({
                data: {
                    carId,
                    userId,
                    startDate: bookingStartDate,
                    endDate: endDate,
                },
            }),
        ]);
        const createdBooking = result[1];

        return res.status(200).json(createdBooking);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error.'});
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
        const booking = await prisma.bookings.findUnique({where: {id: bookingId}});
        if (!booking) {
            return res.status(404).json({error: 'Booking not found.'});
        }

        // Check if the booking can be canceled (within the 24-hour window)
        console.log(booking)
        const currentDateTime = booking.createdAt
        if (booking.createdAt.getTime() - currentDateTime.getTime() <= 24 * 60 * 60 * 1000) {
            return res.status(400).json({error: 'The booking cannot be canceled within 24 hours of the start date.'});
        }

        // Start a database transaction
        await prisma.$transaction([
            // Update car availability
            prisma.cars.update({
                where: {id: booking.carId},
                data: {isAvailable: true},
            }),
            // Mark the booking as canceled
            prisma.bookings.update({
                where: {id: bookingId},
                data: {isCanceled: true, updatedAt: new Date()},
            }),
        ]);

        return res.status(204).json({});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Internal server error.'});
    }
};
