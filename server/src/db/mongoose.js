const mongoose = require('mongoose');
const config = require('../config/config');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.source, config.mongodb.params);

module.exprots = {
  mongoose
}
