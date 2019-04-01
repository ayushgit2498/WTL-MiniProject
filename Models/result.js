const mongoose = require('mongoose');

var resultSchema = new mongoose.Schema({
    dept:{
        type:String,
    },
    sem:Number,
    sno:String,
    sub1:{sName:String,sMarks:Number},
    sub2:{sName:String,sMarks:Number},
    sub3:{sName:String,sMarks:Number},
    sub4:{sName:String,sMarks:Number},
    sub5:{sName:String,sMarks:Number},
});

var Result = new mongoose.model('Result',resultSchema);

module.exports = {Result}