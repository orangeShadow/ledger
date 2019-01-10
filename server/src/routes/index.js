const express = require('express');
const router = express.Router();

const lodash = require('lodash');
const {ObjectID} = require('mongodb');
const {mongoose} = require('../db/mongoose.js');
const {Invoice}  = require('../models/invoice');
const requisites = require('../models/requisites');

const moment = require('moment');
const rubles = require('rubles').rubles;


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

moment.locale('ru-RU');

router.get('/invoice/:id', function(req, res, next) {

  Invoice.findOne({'_id':new ObjectID(req.params.id)}, function(err, invoice){
    res.render('invoice', {
      invoice,
      requisites,
    });
  })
});


router.get('/act/:id', function(req, res, next) {

  Invoice.findOne({'_id':new ObjectID(req.params.id)}, function(err, invoice){
    res.render('act', {
      invoice,
      requisites,
    });
  })
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
