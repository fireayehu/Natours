const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
dotenv.config({ path: './../../config.env' });

mongoose
  .connect('mongodb://localhost:27017/natours', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(connection => {
    console.log('Database Connected Succefully');
  });

const dataT = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const dataU = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const dataR = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(dataT);
    await User.create(dataU, { validateBeforeSave: false });
    await Review.create(dataR);
    console.log('DB created');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('DB deleted');
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
}

if (process.argv[2] === '--delete') {
  deleteData();
}
