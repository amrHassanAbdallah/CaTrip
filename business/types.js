class MyCustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}

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
    MyCustomError, CarNotAvailableErr, BookingStartErr, BookingNotFoundErr, BookingEarlyCancelErr,
}