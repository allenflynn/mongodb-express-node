require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

// console.log(process.env);

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('db connected!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
