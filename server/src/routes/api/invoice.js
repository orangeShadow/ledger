const express = require('express')
const router = express.Router()

const lodash = require('lodash')
const {ObjectID} = require('mongodb')
const {mongoose} = require('../../db/mongoose.js')
const {Invoice} = require('../../models/invoice')

router.get('/', function (req, res, next) {
  Invoice.find({}, function (err, invoices) {
    res.send({data: invoices})
  })
})

router.post('/add', (req, res) => {
  let invoice = new Invoice(req.body)
  let error = invoice.validateSync()
  invoice.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.render('invoice/add', {action: '/invoice/add', create: true, invoice: req.body, errors: e})
  })
})

router.get('/:id', function (req, res, next) {
  Invoice.findOne({'_id': new ObjectID(req.params.id)}, function (err, invoice) {
    if (err) res.send({error: err})

    return res.send(invoice)
  })
})

router.post('/:id', function (req, res, next) {
  Invoice.findOne({'_id': new ObjectID(req.params.id)}, function (err, invoice) {
    if (err) res.send({error: err})

    invoice.set(req.body)

    invoice.save().then((doc) => {
      return res.send(doc);
    }, (e) => {
      return res.send(errorHandler.handler(e), 422).status(422)
    })

    return res.send({invoice})
  })
})

router.delete('/:id', function (req, res, next) {
  Invoice.findByIdAndDelete({'_id':new ObjectID(req.params.id)}, function(err, invoice) {
    return res.send(invoice)
  });
});

module.exports = router