const express=require("express");
const bodyParser=require("body-parser");
let ejs = require('ejs');
const app=express();

app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))

var today = new Date();
 
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

var arr=[];
var works=[];
var now = today.toLocaleString('en-US', options);
console.log(now);

app.get('/',(req,res)=>{
    res.render('index', {cDay: now,Added:arr});
})

app.get('/work',(req,res)=>{
    res.render('index',{cDay: "work",Added:works})
})
app.post('/',(req,res)=>{
    console.log(req.body)
  
    if(req.body.button==="work"){
       
        works.push(req.body.iname);
        res.redirect('/work');

    }else{  
        
        arr.push(req.body.iname)
        res.redirect('/')}
  
})
app.listen(3000,()=>{
    console.log('Server is listening...')
})
