const express = require('express');
const PORT = process.env.PORT || 3000 ;
const bodyParser = require('body-parser');
const app = express();
//*********************************************************************************** */
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//*********************************************************************************** */
require('./Ayush/main')(app);
require('./Krishna/main')(app);

app.get('/test',(req,res)=>{
    res.status(200).send({status:'Ok'});
});


app.listen(PORT,(res)=>{
    console.log(`Server started at port ${PORT}`);
    
});
//  ,(result)=>{
//     console.log(`Server Started at port ${PORT}`);
    
// },(err)=>{
//     console.log("Error is starting port");
    
// });
