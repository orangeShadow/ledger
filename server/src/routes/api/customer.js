const express = require('express');
const router = express.Router();

const lodash = require('lodash');
const {ObjectId} = require('mongodb');
const {mongoose} = require('../../db/mongoose.js');
const {Customer}  =  require('../../models/customer');
const {Invoice}  =  require('../../models/invoice');

const MongooseErrorHandler = require('../../helpers/MongooseErrorHandler');


const errorHandler = new MongooseErrorHandler;

router.get('/', async function(req, res, next) {
    try {
        const customers = await Customer.find({})
        
        // Обработка старых данных для всех клиентов
        for (let customer of customers) {
            if (customer.services_description && customer.services_description.length > 0) {
                // Проверяем, является ли первый элемент строкой (старый формат)
                if (typeof customer.services_description[0] === 'string') {
                    // Конвертируем старые данные в новый формат
                    customer.services_description = customer.services_description.map(service => ({
                        name: service,
                        description: service,
                        postDescription: ''
                    }));
                    await customer.save();
                }
            }
        }
        
        res.send({data:customers});
    } catch (err) {
        return res.status(422).send(errorHandler.handler(err));
    }
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

router.get('/:id/invoice', async function(req, res, next) {
  try {
    const invoices = await Invoice.find({'$or':[{'customer._id':new ObjectId(req.params.id)},{'customer._id':req.params.id}]}).sort({"number":-1})
    res.send({data:invoices});
  } catch (err) {
    res.status(500).send({error: err.message});
  }
});

router.get('/:id/lastInvoice', async function(req, res, next) {
  try {
    const invoices = await Invoice.find(
      {'$or':[{'customer._id':new ObjectId(req.params.id)},{'customer._id':req.params.id}]},
      null,
      {limit:1,sort:{'invoice_date':'desc'}}
    );
    res.send({data:invoices.pop()});
  } catch (err) {
    res.status(500).send({error: err.message});
  }
});

router.post('/:id/invoice', async (req,res) => {
  try {
    const customer = await Customer.findOne({"_id": new ObjectId(req.params.id)})
    if (!customer) {
      return res.status(404).send({error: 'Customer not found'});
    }

    let invoice = new Invoice(req.body);
    invoice.customer = customer;
    let error = invoice.validateSync();
    const doc = await invoice.save();
    return res.send(doc);
  } catch (e) {
    return res.status(422).send(errorHandler.handler(e));
  }
});

router.get('/:id', async function(req, res, next) {
    try {
        const customer = await Customer.findOne({"_id": new ObjectId(req.params.id)})
        if (!customer) {
            return res.status(404).send({error: 'Customer not found'});
        }
        
        // Обработка старых данных services_description
        if (customer.services_description && customer.services_description.length > 0) {
            // Проверяем, является ли первый элемент строкой (старый формат)
            if (typeof customer.services_description[0] === 'string') {
                // Конвертируем старые данные в новый формат
                customer.services_description = customer.services_description.map(service => ({
                    name: service,
                    description: service,
                    postDescription: ''
                }));
                await customer.save();
            }
        }
        
        return res.send({customer});
    } catch (err) {
        return res.status(500).send({error: err.message});
    }
});

router.post('/:id', async function(req, res, next) {
  try {
    const customer = await Customer.findOne({"_id": new ObjectId(req.params.id)})
    if (!customer) {
      return res.status(404).send({error: 'Customer not found'});
    }

    customer.set(req.body);

    const doc = await customer.save();
    return res.send({customer:doc});
  } catch (e) {
    return res.status(422).send(errorHandler.handler(e));
  }
});



module.exports = router;