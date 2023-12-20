// controllers/carController.js
const { validationResult } = require('express-validator');
const prisma = require('./config/database');

exports.createCar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const car = await prisma.cars.create({ data: req.body });
  return res.status(201).json(car);
};

exports.searchCars = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    make, model, price, year, mileage, page = 1, pageSize = 10, sort = 'make'
  } = req.query;
  const filters = {};
  if (make) filters.make = make;
  if (model) filters.model = model;
  if (price) filters.price = price;
  if (year) filters.year = year;
  if (mileage) filters.mileage = mileage;

  const skip = (page - 1) * pageSize;

  // Query the database with pagination and sorting parameters
  const cars = await prisma.cars.findMany({
    where: filters,
    take: pageSize,
    skip,
    orderBy: { [sort]: 'asc' }, // You can change 'asc' to 'desc' if needed
  });
  return res.json(cars);
};
