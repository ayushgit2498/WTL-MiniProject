const mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
    dept:{
        type:String,
    },
    sem1:[{
        sName:String,
        sId:String
    }],
    sem2:[{
        sName:String,
        sId:String
    }],
    sem2:[{
        sName:String,
        sId:String
    }],
    sem3:[{
        sName:String,
        sId:String
    }],
    sem4:[{
        sName:String,
        sId:String
    }],
    sem5:[{
        sName:String,
        sId:String
    }],
    sem6:[{
        sName:String,
        sId:String
    }],
    sem7:[{
        sName:String,
        sId:String
    }],
    sem8:[{
        sName:String,
        sId:String
    }]
});

var Course = new mongoose.model('Course',courseSchema);

module.exports = {Course}