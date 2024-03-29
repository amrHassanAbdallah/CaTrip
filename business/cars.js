const prisma = require('../config/database');

module.exports = {
  Create: async (data) => prisma.cars.create({ data }),
  Search: async ({
    filters, page, pageSize, sort = 'make',
  }) => {
    const skip = (page - 1) * pageSize;

    // Query the database with pagination and sorting parameters
    return prisma.cars.findMany({
      where: filters,
      take: pageSize,
      skip,
      orderBy: { [sort]: 'asc' }, // You can change 'asc' to 'desc' if needed
    });
  },
};
