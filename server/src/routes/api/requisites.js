const express = require('express');
const router = express.Router();

const lodash = require('lodash');
const fs = require('fs');
const requisites = require('../../models/requisites');

router.get('/', function (req, res, next) {
  const requisites = JSON.parse(fs.readFileSync(__dirname+'/../../config/requisites.json', 'utf8'));
  res.send({requisites})
})


router.post('/', function (req, res, next) {
  try {
    fs.writeFileSync(__dirname+'/../../config/requisites.json',JSON.stringify(req.body));
    requisites.refresh();
    res.send({success:true})
  } catch (e) {
    res.status(500).send({success:false, message: e.message || e.toString()});
  }
})

module.exports = router