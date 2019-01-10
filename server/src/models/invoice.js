const mongoose = require('mongoose'), Schema = mongoose.Schema;
const rubles = require('rubles').rubles;

const moment = require('moment');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var ServicesSchema = new Schema({
  title: {
    type: String,
    required:true,
  },
  quantity: {
    type: Number,
    required:true
  },
  unit: {
    type: String,
  },
  price: {
    type: Number,
    required: true
  }
});

var InvoiceSchema = new Schema({
  customer: {
    required:true,
    type: Object
  },
  number: {
    type:Number,
    required: true,
  },
  invoice_date: {
    type: Date,
    default: Date.now
  },
  services: [ServicesSchema],
  createdAt: {
    type: Number,
    default: new Date().getTime()
  },
});

InvoiceSchema.methods.getTotal = function(cb){
  return this.services.reduce((acc, item)=>acc+item.price*item.quantity,0);
};

InvoiceSchema.methods.getTotalString = function(cb){
  return capitalizeFirstLetter(rubles(this.getTotal()))
};

InvoiceSchema.methods.getTitle = function(cb){
  let dt = moment(this.invoice_date).format('DD.MM.YYYY');
  return `Счет № ${this.number} от ${dt}`;
};

InvoiceSchema.methods.getActTitle = function(cb){
  let dt = moment(this.invoice_date).format('DD.MM.YYYY');
  return `Акт № ${this.number} от ${dt}`;
};

InvoiceSchema.methods.getNumberString = function(cb){
  return `Счет № ${this.number}`;
};

InvoiceSchema.methods.getCustomerFullAddress = function(cb){
  let line = [];
  if(this.customer.ZIP) {
    line.push(this.customer.ZIP);
  }
  if(this.customer.area) {
    line.push(this.customer.area);
  }
  line.push(this.customer.city);
  line.push(this.customer.address);
  return line.join(', ');
};

InvoiceSchema.methods.getCustomerLine = function(cb) {
  let line = [];
  line.push(this.customer.title);
  line.push('ИНН '+this.customer.INN);
  if(this.customer.KPP) {
    line.push('КПП '+this.customer.KPP);
  }
  if(this.customer.ZIP) {
    line.push(this.customer.ZIP);
  }
  if(this.customer.area) {
    line.push(this.customer.area);
  }
  line.push(this.customer.city);
  line.push(this.customer.address);

  return line.join(', ');
};

var Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = { Invoice };
