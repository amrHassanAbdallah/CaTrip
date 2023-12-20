const prisma = require('../config/database');
const {
  CarNotAvailableErr, BookingStartErr, BookingNotFoundErr, BookingEarlyCancelErr,
} = require('./types');

module.exports = {
  Book: async ({
    carId, userId, startDate, endDate,
  }) => {
    // Check if the car is available
    const car = await prisma.cars.findUnique({ where: { id: carId } });
    if (!car || !car.isAvailable) {
      throw CarNotAvailableErr();
    }

    // Check if the start date is at least 24 hours in the future
    const bookingStartDate = new Date(startDate);
    const currentDateTime = new Date();

    if (bookingStartDate.getTime() - currentDateTime.getTime() <= 24 * 60 * 60 * 1000) {
      throw BookingStartErr();
    }

    // Start a database transaction
    const result = await prisma.$transaction([
      // Update car availability
      prisma.cars.update({
        where: { id: carId },
        data: { isAvailable: false },
      }),
      // Create a booking record
      prisma.bookings.create({
        data: {
          carId,
          userId,
          startDate: bookingStartDate,
          endDate,
        },
      }),
    ]);
    return result[1];
  },
  Cancel: async ({ bookingId }) => {
    const booking = await prisma.bookings.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw BookingNotFoundErr();
    }

    // Check if the booking can be canceled (within the 24-hour window)
    const currentDateTime = new Date();
    if (currentDateTime.getTime() - booking.createdAt.getTime() <= 24 * 60 * 60 * 1000) {
      throw BookingEarlyCancelErr();
    }

    // Start a database transaction
    await prisma.$transaction([
      // Update car availability
      prisma.cars.update({
        where: { id: booking.carId },
        data: { isAvailable: true },
      }),
      // Mark the booking as canceled
      prisma.bookings.update({
        where: { id: bookingId },
        data: { isCanceled: true, updatedAt: new Date() },
      }),
    ]);
  },
};
