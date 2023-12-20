const { Book, Cancel } = require('../business/bookings');
const prisma = require('../config/database');
const { CarNotAvailableErr } = require('../business/types');

jest.mock('../config/database', () => ({
  cars: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  bookings: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(),
}));


describe('Book function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return booking result when car is available and start date is valid', async () => {
    prisma.cars.findUnique.mockResolvedValue({ isAvailable: true });
    prisma.$transaction.mockResolvedValue([{}, { id: 123 }]);

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 1);
    const result = await Book({
      carId: 1,
      userId: 2,
      startDate: currentDate,
      endDate,
    });

    expect(result).toEqual({ id: 123 });
    expect(prisma.cars.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  test('should return CarNotAvailableErr when the car is not available', async () => {
    prisma.cars.findUnique.mockResolvedValue({ isAvailable: false });
    const err = CarNotAvailableErr();
    await expect(
      Book({
        carId: 1,
        userId: 2,
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      }),
    ).rejects.toEqual(err);
  });

  // Add more tests for other cases as needed
});

describe('Cancel function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should cancel the booking when it exists and is eligible for cancellation', async () => {
    const booking = { id: 123, carId: 1, createdAt: new Date('2023-01-01T00:00:00.000Z') };
    prisma.bookings.findUnique.mockResolvedValue(booking);
    prisma.$transaction.mockResolvedValue([{}, {}]);

    await Cancel({ bookingId: 123 });

    expect(prisma.bookings.findUnique).toHaveBeenCalledWith({ where: { id: 123 } });
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
