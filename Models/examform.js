const mongoose = require('mongoose');

var examformSchema = new mongoose.Schema({
    eno:{
        type:String
    },
    sno:{
        type:String
    },
    name:{
        type:String
    },
    mName:{
        type:String
    },
    clgName:{
        type:String
    },
    centercc:{
        type:Number
    },
    collegec:{
        type:Number
    },
    sub1:{sName:String,sID:Number},
    sub2:{sName:String,sID:Number},
    sub3:{sName:String,sID:Number},
    sub4:{sName:String,sID:Number},
    sub5:{sName:String,sID:Number},
    datefill:{
        type:String
    },
    audit:{
        type:String
    }
});

var ExamForm = new mongoose.model('ExamForm',examformSchema);

module.exports = {ExamForm}