const express = require('express');
const router = express.Router();

const lodash = require('lodash');
const {ObjectID} = require('mongodb');
const {mongoose} = require('../../db/mongoose.js');
const {Customer}  =  require('../../models/customer');
const {Invoice}  =  require('../../models/invoice');

const MongooseErrorHandler = require('../../helpers/MongooseErrorHandler');


const errorHandler = new MongooseErrorHandler;

router.get('/', function(req, res, next) {
    Customer.find({}, function(err, customers){
        res.send({data:customers});
    })
});

router.post('/', (req,res) => {
    let customer = new Customer(req.body);
    let error = customer.validateSync();
    customer.save().then( (doc) =>{
      return res.send({customer:doc});
    }, (e) => {
      return res.send(errorHandler.handler(e), 422).status(422);
    });
});

router.get('/:id/invoice', function(req, res, next) {
  Invoice.find({'$or':[{'customer._id':new ObjectID(req.params.id)},{'customer._id':req.params.id}]}, function(err, invoices){
    res.send({data:invoices});
  })
});

router.post('/:id/invoice', (req,res) => {
  Customer.findOne({"_id": new ObjectID(req.params.id)}, function(err, customer) {
    if (err) res.send('error', {error: err});

    let invoice = new Invoice(req.body);
    invoice.customer = customer;
    let error = invoice.validateSync();
    invoice.save().then( (doc) =>{
      return res.send(doc);
    }, (e) => {
      return res.send(errorHandler.handler(e), 422).status(422);
    });
  });
});

router.get('/:id', function(req, res, next) {
    Customer.findOne({"_id": new ObjectID(req.params.id)}, function(err, customer){
        if(err) res.send({error:err});

        return res.send({customer});
    });
});

router.post('/:id', function(req, res, next) {
  Customer.findOne({"_id": new ObjectID(req.params.id)}, function(err, customer){
    if(err) res.send('error',{error:err});

    customer.set(req.body);

    customer.save().then( (doc) =>{
      return res.send({customer:doc});
    }, (e) => {
      return res.send(errorHandler.handler(e), 422).status(422);
    });
  });
});



module.exports = router;