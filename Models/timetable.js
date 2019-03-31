const mongoose = require('mongoose');

var timetableSchema = new mongoose.Schema({
    dept:String,
    sem:Number,
    sub1:{sName:String,dexam:String},
    sub2:{sName:String,dexam:String},
    sub3:{sName:String,dexam:String},
    sub4:{sName:String,dexam:String},
    sub5:{sName:String,dexam:String},
});

var TimeTable = new mongoose.model('Timetable',timetableSchema);

module.exports = {TimeTable}