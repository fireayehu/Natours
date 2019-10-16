const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const tour = Object.assign({ id: newId }, req.body);
  tours.push(tour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: { tour }
      });
    }
  );
};
exports.getTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tour = tours.find(tour => tour.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({ status: 'success', data: { tour } });
};

exports.updateTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tour = tours.find(tour => tour.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({
    status: 'success',
    data: { tour: '<Updated tour here...>' }
  });
};

exports.deleteTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tour = tours.find(tour => tour.id === id);
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
};
