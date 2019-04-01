var alias = '/kr';
const express = require('express');
const mongoose = require(process.cwd() + '/mongooseconnect.js');
const _ = require('lodash');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
//*********************************************************************************** */
var {Student} = require(process.cwd() + '/Models/student');
var {Course} = require(process.cwd() + '/Models/course');
var {TimeTable} = require(process.cwd() + '/Models/timetable');
var {Result} = require(process.cwd() + '/Models/result');
var {Register} = require(process.cwd() + '/Models/register');

var colleges = {
    'PICT':['Pune Institue of Computer Technology',4005,4005],
    'PVG':['Pune Vidyarathi Grah',4006,4010],
    'SP':['Sandeep Foundation',4321,4351],        //Sandeep Foundation
    'AISSMS':['AISSMS',4050,4051],
    'KKV':['KK Vagh',4322,4322],   //kkvagh
}
//*********************************************************************************** */


module.exports = function(app){

    const redirectlogin = (req,res,next)=>{
        console.log(req.session);
        
        if (!req.session.eno){
            res.redirect('/bh/logina');
        }   
        else{
            next();
        }
    }
    const redirecthome = (req,res,next)=>{
        if(req.session.eno){
            res.redirect('/bh/homea');
        }
        else{
            next();
        }
    }

    app.use('/public',express.static('public')); //__dirname - path of root directory //we can directly access pages as /name.html
    app.use(express.static(__dirname + '/public'));

    const hbs = exphbs.create({ 
        extname:'hbs',
    });
    
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const SESS_NAME = 'sid'
    app.use(session({
        secret:'examlogin',
        name:SESS_NAME,    //To-do Destructure secret,SESS_NAME from process.env
        saveUninitialized:false,
        cookie:{
            sameSite: true,
            maxAge:1000*60*60*5
        }
    }));

    app.get(alias+'/registerfirst',(req,res)=>{
        res.render('checkregister',{filled:false})
    });

    app.post(alias+'/registerfirst',(req,res)=>{

        Register.find({"eno":req.body.eno}).then((docs)=>{
            if(!docs.length){
                var msg = "You are not a member of SPPU";
                res.render('checkregister',{filled:true,msg});
            }
            else{
                if(!docs[0].check)
                    res.redirect('/kr/register');
                else{
                    var msg = "You have already registered";
                    res.redirect('/bh/logina');
                }
            }
        });

    });

    app.post(alias+'/register',redirecthome,(req,res)=>{        //To-do  first check of eligibility no
        console.log('entered');
        console.log(req);
        
        var nstudent = _.pick(req.body,['eno','name','mName','dept','clgName','gender','dob','state','address','phoneNo','year','sem','emailid','password']);       
        nstudent.phoneNo = Number(nstudent.phoneNo);
        nstudent.year = Number(nstudent.year);
        nstudent.sem = Number(nstudent.sem);
        nstudent.sno = 'F' + colleges[req.body.clgName][2] + req.body.eno.slice(req.body.eno.length-4,);
        console.log(nstudent);
        
        var s = new Student(nstudent);

        s.save().then((result)=>{
            Register.update({"eno":req.body.eno},{$set:{"check":true}});
            console.log('Registered Successfully');
            //res.render('index',{Name:result.name});
            req.session.emailid =  req.body.emailid;
            req.session.eno = result.eno;
            console.log(req.session);
            
            res.redirect('/bh/homea');
        },(err)=>{
            console.log('Error Saving student');
            res.status(200).send();
        });
    });

    app.get(alias+'/register',redirecthome,(req,res)=>{
        console.log('register');
        
        res.render('registration',{});
    });

    app.get(alias+'/course',(req,res)=>{
        Course.find().then((docs)=>{
            res.send(docs);
        },(err)=>{
            console.log(err);
            console.log("Error in fetching courses");
            
        });
    });

    app.post(alias+'/course',redirecthome,(req,res)=>{
        var nfilter = _.pick(req.body,['dept']);
        var ncourse = new Course(nfilter);
        for(let i=1;i<=8;i++){
            var temp = req.body[`sem${i}`];
            for(let j=0;j<5;j++){
                ncourse[`sem${i}`].push(temp[j]);
            }
        }
        ncourse.save().then((docs)=>{
            res.send(docs);
        },(err)=>{
            console.log(err);
            console.log("Error in fetching courses");
            
        });
    });

    app.get(alias+'/admin',(req,res)=>{
        res.render('admin');
    });

    app.get(alias+'/admin/timetable',(req,res)=>{
        // var subs = [{sName:'a',sId:1},{sName:'a',sId:1},{sName:'a',sId:1},{sName:'a',sId:1},{sName:'a',sId:1}];
        //console.log(subs[0].sName);
        var sName1 = 'test';
        var sName2 = 'test';
        var sName3 = 'test';
        var sName4 = 'test';
        var sName5 = 'test';        
        res.render('timetableAdmin',{filled:false,sName1,sName2,sName3,sName4,sName5});
    });
    app.post(alias+'/admin/timetable',(req,res)=>{
        Course.find({"dept":req.body.dept}).then((subjects)=>{
            console.log(subjects);
            var temp = subjects[0];
            console.log(temp);
            
            var subs = temp[`sem${req.body.sem}`];
            console.log(subs[0].sName);
            var sName1 = subs[0].sName;
            var sName2 = subs[1].sName;
            var sName3 = subs[2].sName;
            var sName4 = subs[3].sName;
            var sName5 = subs[4].sName;

            res.render('timetableAdmin',{filled:true,sName1,sName2,sName3,sName4,sName5});
        });
    });
    app.post(alias+'/admin/savetimetable',(req,res)=>{
        console.log(req.body);
        var ntimetable = new TimeTable({
            dept:req.body.dept,
           sem:req.body.sem,
           sub1:{
               sName:req.body.sn1,
               dexam:req.body.s1
           },
           sub2:{
            sName:req.body.sn2,
            dexam:req.body.s2
            },
            sub3:{
                sName:req.body.sn3,
                dexam:req.body.s3
            },
            sub4:{
                sName:req.body.sn4,
                dexam:req.body.s4
            },
            sub5:{
                sName:req.body.sn5,
                dexam:req.body.s5
            }
        });
        ntimetable.save().then((docs)=>{
            res.redirect('/kr/admin');
        },(err)=>{
            console.log(err);
            
        });
    });

    app.get(alias+'/timetable',(req,res)=>{
        res.render('timetableFinal',{filled:false});
    });
    app.post(alias+'/timetable',(req,res)=>{
        TimeTable.find({"dept":req.body.dept,"sem":req.body.sem}).then((docs)=>{
            var temp = docs[0];
            res.render('timetableFinal',{filled:true,temp})
        });
    });

    app.get(alias+'/admin/result',(req,res)=>{
        res.render('setresult',{filled:false});
    });
    app.post(alias+'/admin/result',(req,res)=>{

        Course.find({"dept":req.body.dept}).then((subjects)=>{
            console.log(subjects);
            var temp = subjects[0];
            console.log(temp);
            
            var subs = temp[`sem${req.body.sem}`];
            console.log(subs[0].sName);
            var sName1 = subs[0].sName;
            var sName2 = subs[1].sName;
            var sName3 = subs[2].sName;
            var sName4 = subs[3].sName;
            var sName5 = subs[4].sName;

            res.render('setresult',{filled:true,sName1,sName2,sName3,sName4,sName5});
        });
    });
    app.post(alias+'/admin/resultstore',(req,res)=>{
        if(req.body.sno===''){
            Course.find({"dept":req.body.dept}).then((subjects)=>{
                console.log(subjects);
                var temp = subjects[0];
                console.log(temp);
                
                var subs = temp[`sem${req.body.sem}`];
                console.log(subs[0].sName);
                var sName1 = subs[0].sName;
                var sName2 = subs[1].sName;
                var sName3 = subs[2].sName;
                var sName4 = subs[3].sName;
                var sName5 = subs[4].sName;
    
                res.render('setresult',{filled:true,sName1,sName2,sName3,sName4,sName5});
            });
        }
        else{
            console.log(req.body);
            var nresult = new Result({
            dept:req.body.dept,
            sem:req.body.sem,
            sno:req.body.sno,
            sub1:{
                sName:req.body.sn1,
                sMarks:Number(req.body.sMarks1)
            },
            sub2:{
                sName:req.body.sn2,
                sMarks:Number(req.body.sMarks2)
                },
                sub3:{
                    sName:req.body.sn3,
                    sMarks:Number(req.body.sMarks3)
                },
                sub4:{
                    sName:req.body.sn4,
                    sMarks:Number(req.body.sMarks4)
                },
                sub5:{
                    sName:req.body.sn5,
                    sMarks:Number(req.body.sMarks5)
                }
            });
            nresult.save().then((docs)=>{
                res.render('setresult',{filled:true,check:true,sName1:req.body.sn1,sName2:req.body.sn2,sName3:req.body.sn3,sName4:req.body.sn4,sName5:req.body.sn5});
                console.log(docs);
                
            },(err)=>{
                console.log(err);
                
            });
    }
    });

    app.get(alias+'/client/result',(req,res)=>{
        res.render('result',{filled:false});
    });
    app.post(alias+'/client/result',(req,res)=>{
        console.log(req.body.sno);
        
        Student.find({"sno":String(req.body.sno)}).then((docs)=>{
            console.log(docs);
            Result.find({"sno":String(req.body.sno),"sem":docs[0]['sem']}).then((subjects)=>{
                console.log(subjects);
                var temp = subjects[0];
                console.log(temp);
                var cgpa ;
                for(let i=1;i<=5;i++){
                    cgpa += temp[`sub${i}`].sMarks;
                }
                cgpa /= 5;
                cgpa /= 8.5;

                res.render('result',{filled:true,sName1:temp.sub1.sName,sName2:temp.sub2.sName,sName3:temp.sub3.sName,sName4:temp.sub4.sName,sName5:temp.sub5.sName,sMarks1:temp.sub1.sMarks,sMarks2:temp.sub2.sMarks,sMarks3:temp.sub3.sMarks,sMarks4:temp.sub4.sMarks,sMarks5:temp.sub5.sMarks,cgpa});
            });
        });
        Result.find({"sno":req.body.sno}).then((subjects)=>{
            console.log(subjects);
            var temp = subjects[0];
            console.log(temp);
            var cgpa=0,counter,status;
            let j=1;
            counter=0;
            for(let i=1;i<=5;i++){
                cgpa = cgpa + temp[`sub${i}`].sMarks;               
                if(temp[`sub${i}`].sMarks>40)
                    counter++;
            }
            if(counter===5)
                status = "PASS";
            else
                status = "FAILED";
            cgpa = cgpa / 5;
            cgpa = cgpa / 8.5;
            console.log(cgpa);
            
            res.render('result',{filled:true,sName1:temp.sub1.sName,sName2:temp.sub2.sName,sName3:temp.sub3.sName,sName4:temp.sub4.sName,sName5:temp.sub5.sName,sMarks1:temp.sub1.sMarks,sMarks2:temp.sub2.sMarks,sMarks3:temp.sub3.sMarks,sMarks4:temp.sub4.sMarks,sMarks5:temp.sub5.sMarks,cgpa,status});
        });
    });

}