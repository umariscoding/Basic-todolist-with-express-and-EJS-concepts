const express=require("express");
const bodyParser=require("body-parser");
let ejs = require('ejs');
const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://admin:admin@cluster0.vpf0xqr.mongodb.net/toDoListDb?retryWrites=true&w=majority",{useNewUrlParser: true});

const app=express();

app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }))


const itemsSchema={
    name: String,
}

let Item = mongoose.model('Item',itemsSchema);

const customListSchema={
    name: String,
    list:[itemsSchema]
}

let customList = mongoose.model('customList',customListSchema);

const item1 = new Item({
    name:"Cat"
});
const item2 = new Item({
    name:"Dog"
});
const item3 = new Item({
    name:"Horse"
});

var defaultItems=[item1,item2,item3];





app.get('/',(req,res)=>{

    Item.find({}).then(function(FoundItems){    
        // console.log(FoundItems);
        if(FoundItems.length==0){
            Item.insertMany(defaultItems).then(()=>{
                console.log('Inserted Default items'); 
            });
            res.redirect('/');
        }else{
        res.render('index', {cDay: 'Today',Added:FoundItems});
    }
        })
        .catch(function(err){
            console.log(err);
        })
    
})


app.get('/:custompath',(req,res)=>{
    let pageName=req.params.custompath;
  //  console.log(pageName);
    customList.findOne({name:pageName}).then((foundObj)=>{
        if(!foundObj){
            const list1 = new customList({
            name:pageName,
            list:defaultItems   
           });
           list1.save();}
        else{
         //   console.log(foundObj)

            res.render('index',{cDay:foundObj.name,Added:foundObj.list});
        }
        
    })

    
    

})


app.post('/',(req,res)=>{
    console.log(req.body);
  
    var itemName = req.body.iname;
    var buttontag = req.body.button;
    var item=new Item({
        name:itemName
    });

    if(buttontag=='Today'){
        item.save()
        res.redirect('/')   
      }else{
        customList.findOne({name:buttontag}).then((found)=>{
            if(!found){
                console.log("does not exist");
            }else{
                found.list.push(item);
                found.save();
            }
        })
      }
    
});

app.post('/delete',(req,res)=>{
    idToBeDeleted=req.body.checkbox
    Item.findByIdAndDelete(idToBeDeleted).then((deletedItem) => {
            console.log(deletedItem);
    });
    res.redirect('/');
});

app.listen(3000,()=>{
    console.log('Server is listening...')
});
