// controllers/cars.js
const {validationResult} = require('express-validator');
const prisma = require('../config/database');
const {Create, Search} = require("../business/cars");

exports.createCar = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const car = Create(req.body)
    return res.status(201).json(car);
};

exports.searchCars = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {
        make, model, price, year, mileage, page = 1, pageSize = 10, sort
    } = req.query;
    const filters = {};
    if (make) filters.make = make;
    if (model) filters.model = model;
    if (price) filters.price = price;
    if (year) filters.year = year;
    if (mileage) filters.mileage = mileage;

    let cars = await Search({filters,page,pageSize,sort})
    return res.json(cars);
};
