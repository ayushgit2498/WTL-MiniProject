var alias = '/bh';
const express = require('express');
const mongoose = require(process.cwd() + '/mongooseconnect.js');
const _ = require('lodash');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
//*********************************************************************************** */
var {Student} = require(process.cwd() + '/Models/student');
var {Course} = require(process.cwd() + '/Models/course');
var {ExamForm} = require(process.cwd() + '/Models/examform');
var colleges = {
    PICT:['Pune Institue of Computer Technology',4005,4005],
    PVG:['Pune Vidyarathi Grah',4006,4010],
    SP:['Sandeep Foundation',4321,4351],        //Sandeep Foundation
    AISSMS:['AISSMS',4050,4051],
    KKV:['KK Vagh',4322,4322],   //kkvagh
}
const hbs = exphbs.create({ 
    defaultlayout:'main',
    extname:'hbs',


    helpers:{
        calculation:(value)=>{
            return value+7;
        },
        list:function(items,options){
            var out = "<ul>";
            console.log(items);
            
            for(let i=0;i<items.length;i++){
                console.log(items[i]);
                
                out = out + "<li>" + options.fn(items[i]) + "</li>";
            }

            return out + "</ul>";
        },
        testing:function(t1,t2){
            return t1+t2;
        },
        ifc:function(value,index,options){
            if(index%2==0){
                return options.fn(this);
            }
            else
                return options.inverse(this);
        }

    }
});

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

    app.use(express.static('public'))
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
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');

    app.get('/examdash',(req,res)=>{
        res.render('examdash');
    });

    app.get(alias+'/logina',redirecthome,(req,res)=>{
        res.render('logina',{check:true});
    });

    app.post(alias+'/logina',(req,res)=>{
        console.log(`Inside post loginapi`);
        
        Student.find({"emailid":req.body.emailid,"password":req.body.password}).then((docs)=>{
            if(!docs.length){
                res.render('logina',{check:false});
            }
            else{
                console.log(docs[0].admin);
                
                if(!docs[0].admin){
                    console.log(`docs ${docs}`);
                    console.log(docs[0].eno + 'testing');
                    
                    req.session.emailid =  req.body.emailid;
                    req.session.eno = docs[0].eno;
                    req.session.admin = false;
                    res.redirect('/bh/homea');
                }
                else{
                    req.session.emailid =  req.body.emailid;
                    req.session.eno = docs[0].eno;
                    //req.sesion.admin = true;
                    res.redirect('/kr/admin');                  
                }

            }
        },(err)=>{
            console.log(err);
            
        });
    });
    app.get(alias+'/homea',redirectlogin,(req,res)=>{
        res.render('homea');
    });

    // app.get(alias+'/registera',(req,res)=>{

    // });
    // app.post(alias+'/registera',(req,res)=>{

    // });

    app.post(alias+'/logouta',redirectlogin,(req,res)=>{
        req.session.destroy((err)=>{
            if(err)
                return res.redirect('/bh/homea');
            
            res.clearCookie(SESS_NAME);
            res.redirect('/bh/logina');
        })
    });

    app.get(alias+'/examforma', (req,res)=>{
        Student.find({"eno":req.session.eno}).then((docs)=>{
            console.log(docs);
            var docs1 = docs[0];
            //var temp = docs1.sem1[0].sName;
            console.log(docs1);
            
            Course.find({"dept":docs1.dept}).then((subjects)=>{
                console.log(subjects);
                //console.log(temp);
                var temp = subjects[0];
                console.log(temp);
                
                var subs = temp[`sem${docs1.sem}`];
                console.log(subs[0].sName);
                
                docs1.sno = 'T150054305';
                docs1.college = colleges[docs1.clgName][0];
                docs1.centercc = colleges[docs1.clgName][1];
                docs1.collegec = colleges[docs1.clgName][2]
                res.render('examform',{docs1,subs});
            });
        },(err)=>{
            console.log(err);
            
        });
    });

    app.post(alias+'/generate', (req,res)=>{
        Student.find({"eno":req.session.eno}).then((docs)=>{
            console.log(docs);
            var docs1 = docs[0];
            console.log(docs1);
            
            Course.find({"dept":docs1.dept}).then((subjects)=>{
                console.log(subjects);
                //console.log(temp);
                var temp = subjects[0];
                console.log(temp);
                
                var subs = temp[`sem${docs1.sem}`];
                console.log(subs[0].sName);
                
                docs1.sno = 'T150054305';
                docs1.college = colleges[docs1.clgName][0];
                docs1.centercc = colleges[docs1.clgName][1];
                docs1.collegec = colleges[docs1.clgName][2];
                var audit = req.body.audit.slice(2,);
                var acode = req.body.audit.slice(0,2);
                console.log(audit);
                console.log(acode);
                
                var context = {
                    docs1,subs,audit,acode
                }
                var temp2 = `sem${docs1.sem}`;
                var update={};
                update[temp2]=true;
                update['audit'] = audit;
                Student.update({"eno":req.session.eno},{$set:update}).then((docs)=>{

                });

                res.render('hallticket',context);
            });
        },(err)=>{
            console.log(err);
            
        });
    });

};