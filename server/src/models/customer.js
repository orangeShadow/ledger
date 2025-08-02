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
  services_description: {
    type: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      postDescription: {
        type: String,
        required: false,
        trim: true,
        default: ''
      }
    }],
    required: false,
    default: []
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

CustomerSchema.methods.getServicesDescription = function(cb){  
  return this.services_description || [];
};

CustomerSchema.methods.getServiceNames = function(cb){  
  if (!this.services_description) return [];
  
  // Обработка старого формата (массив строк)
  if (this.services_description.length > 0 && typeof this.services_description[0] === 'string') {
    return this.services_description;
  }
  
  // Новый формат (массив объектов)
  return this.services_description.map(service => service.name);
};

var Customer = mongoose.model('Customer', CustomerSchema, 'customers');

module.exports = { Customer };
