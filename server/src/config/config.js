module.exports = {
  port: 8081,
  mongodb: {
    source: 'mongodb://localhost:27017/ledger',
    params: {
      useCreateIndex: true, useNewUrlParser: true
    }
  }
}