const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  price: String,
  category: String,
  loggedInUserId: String,
  company: String
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
