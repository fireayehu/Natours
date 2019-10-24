const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(connection => {
    console.log('Database Connected Succefully');
  });

const app = require('./app');
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Application Running at port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.error('UNHANDELED REJECTION');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
