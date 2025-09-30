const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.connect(config.mongodb.source, config.mongodb.params)
  .then(async () => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = {
  mongoose
}
