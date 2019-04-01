const mongoose = require('mongoose');

var registerSchema = new mongoose.Schema({
   eno:{
       type:String
   },
   check:{
       type:Boolean,
       default:false
   }
});

var Register = new mongoose.model('Register',registerSchema);

module.exports = {Register}