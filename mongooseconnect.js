const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var url = "mongodb://wtl:wtl123@ds127736.mlab.com:27736/exam";
mongoose.connect(url).then((res)=>{
    console.log("Connected to db exam");
    
    
},(err)=>{
    console.log("Error occured while connecting to db");
    
});

module.export = { mongoose };
