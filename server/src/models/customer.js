const mongoose = require('mongoose'), Schema = mongoose.Schema;

var CustomerSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim:true
  },
  INN: {
    type: String,
    required:true,
    unique: true,
    trim:true    
  },
  KPP: {
    type: String,
    required:true,
    min:1,
    trim:true
  },
  OGRN: {
    type: String,
    required:false,
    min:10
  },
  ZIP: {
    type: String,
    required:true,
    min:6,
    trim:true    
  },
  area: {
    type: String,
    required:false,
    min:0,
    trim:true    
  },
  city: {
    type: String,
    required:true,
    min:1,
    trim:true    
  },
  address: {
    type: String,
    required:true,
    min:1,
    trim:true    
  },
  reason: {
    type: String,
    trim:true
  },
  createdAt: {
    type: Number,
    default: new Date().getTime()
  },
});

CustomerSchema.methods.getFullAddress = function(cb){  
  return [this.ZIP, this.area, this.city, this.address].filter().join(', ');
};

CustomerSchema.methods.getCustomerLine = function(cb){  
  return [this.title, 'ИНН '+this.INN, 'КПП'+ this.KPP, this.ZIP, this.area, this.city, this.address].filter().join(', ');
};

var Customer = mongoose.model('Customer', CustomerSchema);

module.exports = { Customer };
