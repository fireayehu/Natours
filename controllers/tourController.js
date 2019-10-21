const Tour = require('../models/tourModel');

exports.getAllTours = (req, res) => {
  // res
  //   .status(200)
  //   .json({ status: 'success', results: tours.length, data: { tours } });
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour }
    });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: 'Invalid Input' });
  }
};
exports.getTour = (req, res) => {
  //res.status(200).json({ status: 'success', data: { tour } });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { tour: '<Updated tour here...>' }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
