const express = require('express')
const router = express.Router()

const lodash = require('lodash')
const {ObjectId} = require('mongodb')
const {mongoose} = require('../../db/mongoose.js')
const {Invoice} = require('../../models/invoice')

router.get('/', async function (req, res, next) {
  try {
    const invoices = await Invoice.find({})
    res.send({data: invoices})
  } catch (err) {
    res.status(500).send({error: err.message})
  }
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

router.get('/:id', async function (req, res, next) {
  try {
    const invoice = await Invoice.findOne({'_id': new ObjectId(req.params.id)})
    if (!invoice) {
      return res.status(404).send({error: 'Invoice not found'})
    }
    return res.send(invoice)
  } catch (err) {
    return res.status(500).send({error: err.message})
  }
})

router.post('/:id', async function (req, res, next) {
  try {
    const invoice = await Invoice.findOne({'_id': new ObjectId(req.params.id)})
    if (!invoice) {
      return res.status(404).send({error: 'Invoice not found'})
    }

    invoice.set(req.body)

    const doc = await invoice.save()
    return res.send(doc)
  } catch (e) {
    return res.status(422).send({error: e.message || e.toString()})
  }
})

router.delete('/:id', async function (req, res, next) {
  try {
    const invoice = await Invoice.findByIdAndDelete(new ObjectId(req.params.id))
    if (!invoice) {
      return res.status(404).send({error: 'Invoice not found'})
    }
    return res.send(invoice)
  } catch (err) {
    return res.status(500).send({error: err.message})
  }
});

module.exports = router