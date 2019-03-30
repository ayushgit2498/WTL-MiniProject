var alias = '/kr';
const express = require('express');
const mongoose = require(process.cwd() + '/mongooseconnect.js');
const _ = require('lodash');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
//*********************************************************************************** */
var {Student} = require(process.cwd() + '/Models/student');
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

    app.post(alias+'/register',redirecthome,(req,res)=>{        //To-do  first check of eligibility no
        console.log('entered');
        console.log(req);
        
        var nstudent = _.pick(req.body,['eno','name','mName','dept','clgName','gender','dob','state','address','phoneNo','year','sem','emailid','password']);       
        nstudent.phoneNo = Number(nstudent.phoneNo);
        nstudent.year = Number(nstudent.year);
        nstudent.sem = Number(nstudent.sem);
        console.log(nstudent);
        
        var s = new Student(nstudent);

        s.save().then((result)=>{
            console.log('Registered Successfully');
            //res.render('index',{Name:result.name});
            req.session.emailid =  req.body.emailid;
            req.session.eno = result.eno;
            return res.redirect('/bh/homea');
        },(err)=>{
            console.log('Error Saving student');
            res.status(200).send();
        });
    });

    app.get(alias+'/register',redirecthome,(req,res)=>{
        console.log('register');
        
        res.render('registration',{});
    });

};