var alias = '/bh';
const express = require('express');
const mongoose = require(process.cwd() + '/mongooseconnect.js');
const _ = require('lodash');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
//*********************************************************************************** */
var {Student} = require(process.cwd() + '/Models/student');
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
                console.log(docs);
                console.log(docs.eno + 'testing');
                
                req.session.emailid =  req.body.emailid;
                req.session.eno = docs[0].eno;
                return res.redirect('/bh/homea');
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
    

};