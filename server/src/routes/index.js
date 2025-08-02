const express = require('express');
const router = express.Router();

const lodash = require('lodash');
const {ObjectId} = require('mongodb');
const {mongoose} = require('../db/mongoose.js');
const {Invoice}  = require('../models/invoice');
const requisites = require('../models/requisites');

const moment = require('moment');
const rubles = require('rubles').rubles;


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

moment.locale('ru-RU');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/customer', function(req, res, next) {
  res.render('index');
});

router.get('/invoice/:id', async function(req, res, next) {
  try {
    const invoice = await Invoice.findOne({'_id':new ObjectId(req.params.id)})
    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }
    res.render('invoice', {
      invoice,
      requisites,
      signature: req.query.signature ? req.query.signature:1
    });
  } catch (err) {
    res.status(500).send('Error loading invoice');
  }
});

router.get('/act/:id', async function(req, res, next) {
  try {
    const invoice = await Invoice.findOne({'_id':new ObjectId(req.params.id)})
    if (!invoice) {
      return res.status(404).send('Invoice not found');
    }
    res.render('act', {
      invoice,
      requisites,
      signature: req.query.signature ? 1:0
    });
  } catch (err) {
    res.status(500).send('Error loading act');
  }
});


/*
let services = [
  {
    'title': 'Абонентское обслуживание программного комплекса согласно п 3.1 договора за сентябрь месяц 2018',
    'quantity': 1,
    'unit': "шт",
    'price': 20000
  },

  {
    'title': 'Развитие и внесение изменений в программный комлекс согласно п 3.2 договора за сентябрь месяц 2018',
    'quantity': 17,
    'price': 600
  }
];
*/

module.exports = router;
