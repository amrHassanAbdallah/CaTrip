const prisma = require("../config/database");
const MyCustomError = require("./types");

function CarNotAvailableErr() {
    // Simulate an error
    return new MyCustomError('The selected car is not available for booking.', 400);
}
function BookingStartErr() {
    // Simulate an error
    return new MyCustomError('The booking start date must be at least 24 hours in the future.', 400);
}
function BookingNotFoundErr() {
    // Simulate an error
    return new MyCustomError('Booking not found.', 404);
}
function BookingEarlyCancelErr() {
    // Simulate an error
    return new MyCustomError('The booking cannot be canceled within 24 hours of the start date.', 400);
}

module.exports = {
    Book: async ({carId, userId, startDate, endDate}) => {
        // Check if the car is available
        const car = await prisma.cars.findUnique({where: {id: carId}});
        if (!car || !car.isAvailable) {
            return CarNotAvailableErr()
        }

        // Check if the start date is at least 24 hours in the future
        const bookingStartDate = new Date(startDate);
        const currentDateTime = new Date();

        if (bookingStartDate.getTime() - currentDateTime.getTime() <= 24 * 60 * 60 * 1000) {
            return BookingStartErr()
        }

        // Start a database transaction
        let result = await prisma.$transaction([
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
        return result[1];

    },
    Cancel: async ({bookingId}) => {
        const booking = await prisma.bookings.findUnique({where: {id: bookingId}});
        if (!booking) {
            return BookingNotFoundErr();
        }

        // Check if the booking can be canceled (within the 24-hour window)
        console.log(booking)
        const currentDateTime = booking.createdAt
        if (booking.createdAt.getTime() - currentDateTime.getTime() <= 24 * 60 * 60 * 1000) {
            return BookingEarlyCancelErr();
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
    }
}
