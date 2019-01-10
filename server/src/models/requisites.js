const fs = require('fs');
const data = JSON.parse(fs.readFileSync(__dirname+'/../config/requisites.json', 'utf8'));

class Requisites {
  constructor (data) {
    this.setData(data);
  }

  setData(data) {
    for (let k in data) {
      this[k] = data[k]
    }
  }

  get (name) {
    if (typeof this[name] !== 'undefined') {
      return this[name]
    }
    return ''
  }

  executor () {
    return [this.recipient_small, 'ИНН ' + this.INN, this.ZIP, this.city, this.address].join(', ')
  }

  refresh() {
    let data = JSON.parse(fs.readFileSync(__dirname+'/../config/requisites.json', 'utf8'));
    this.setData(data);
  }
}

requisites = new Requisites(data)

module.exports = requisites