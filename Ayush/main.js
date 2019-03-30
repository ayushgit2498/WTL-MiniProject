var alias = '/bh';
const express = require('express');
const mongoose = require(process.cwd() + '/mongooseconnect.js');
const _ = require('lodash');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
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
    app.use(express.static('public'))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');
    

};