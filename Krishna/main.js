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
    app.use('/public',express.static('public')); //__dirname - path of root directory //we can directly access pages as /name.html
    app.use(express.static(__dirname + '/public'));

    const hbs = exphbs.create({ 
        extname:'hbs',
    });
    
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        secret:'examlogin'
    }))

    app.post(alias+'/insert',(req,res)=>{
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
            res.render('index',{Name:result.name});
        },(err)=>{
            console.log('Error Saving student');
            res.status(200).send();
        });
    });

    app.get(alias+'/login',(req,res)=>{
        res.render('login',{check:true});
    });
    app.post(alias+'/login',(req,res)=>{
        Student.find({"emailid":req.body.emailid,"password":req.body.password}).then((docs)=>{
            if(!docs.length){
                res.render('login',{check:false});
            }
            else{
                req.session.emailid =  req.body.emailid;
                req.session.password = req.body.password;
                res.render('logout');
            }
        },(err)=>{
            console.log(err);
            
        });
        
        //res.render('index',{Name:'login'})
    });
    app.get(alias+'/logged',(req,res)=>{
        if(req.session.emailid){
            res.render('sample',{Name:req.session.emailid});
        }
        else{
            res.send({
                msg:"Please login"
            })
        }
    });
    app.post(alias+'/logout',(req,res)=>{
        req.session.destroy(function(err){
            if(err)
                res.negotiate(err);
            else
                res.send("Logged out successfully")   
        })
    });
    app.get(alias+'/register',(req,res)=>{
        console.log('register');
        
        res.render('registration2',{});
    });

};