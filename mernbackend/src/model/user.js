const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  contactnumber: Number,
  email: String,
  password: String, 
  confirmpassword:String,
 gender: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
