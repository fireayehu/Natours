const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(connection => {
    console.log('Database Connected Succefully');
  });

const app = require('./app');
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Application Running at port ${port}...`);
});
