const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  pass: String
});

const User = mongoose.model('Product', UserSchema);

module.exports = User;
