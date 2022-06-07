var express = require('express')
var app = express()
var bodyParser = require('body-parser');
//var mongoose = require('mongoose')
let mongodb=require("mongodb")
var fs = require('file-system');
var path = require('path');
var multer = require('multer');
var cors=require("cors");
const boolean = require('joi/lib/types/boolean');


//Connection and scghema

let password=``;
let db_name=``;
let collection_name=`employees`
let db_url=`mongodb+srv://:${password}@cluster0.x0us0.mongodb.net/${db_name}?retryWrites=true&w=majority`


let mernClient=mongodb.MongoClient;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
// Set EJS as templating engine 
//app.set("view engine", "ejs");

// Step 5 - set up multer for storing uploaded files



var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	}
});

var upload = multer({ storage: storage });

//Sucess
app.post('/storage2', upload.single('myImage'), (req, res, next) => {
//    console.log(req.body.img);
//    return;
if(req.file){
    var img=fs.readFileSync(req.file.path);
var encoded_img= img.toString('base64');
// console.log(encoded_img);
// return;
var finalImage= {
    contentType:req.file.mimetype,
    path:req.file.path,
    image:encoded_img
};
}
    var obj = {
       
     
            "uid":req.body.uid,
            "name": req.body.name,
            "tagline":req.body.tagline,
            "schedule":req.body.schedule,
            "desc": req.body.desc,
            "moderator":req.body.moderator,
            "category":req.body.category,
            "sub_category":req.body.sub_category,
            "rigor_rank":req.body.regor_rank,
            //attendees:req.body.attendees,
          // $push: { attendees: req.body.attendees },
            "myImage": finalImage,
           // "myImage":req.file,
    //    "attendees":[req.body.attendees] ,
      //'$push': { attendees: req.body.attendees },
      '$addToSet': { attendees: [req.body.attendees] }
    };
    //Validation

    //
    //res.send(obj);
   // return;

    mernClient.connect(db_url,{useNewUrlParser:true}, (err,client)=>{
        if(err) throw err;
        else{
            console.log("Connection Sucess")
            let db=client.db(db_name);
            db.collection(collection_name).insertOne(obj,(err,result)=>{
                if(err) throw err;
                else{
                    console.log(`Added a new match with id ${result.insertedId}` );
                    res.send({insert:`Added a new match with id ${result.insertedId}`});
                }
            })
        }
    });

    // imgModel.create(obj, (err, item) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         // item.save();
    //         res.send(item);
    //     }
    // });
});


//Fail
app.get("/eventsog",(req,res) =>{

    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
            else{
                //throw client object
                //database instance
               let db= client.db(db_name);
               db.collection(collection_name).find().toArray((err,arr)=>{
                 if(err) throw err;
                 else{
                    // res.send(JSON.stringify(arr));
                     res.send(arr);
                 }
               })
            }
        })
});

//Fail
app.get("/eventsog/:id",(req,res) =>{

    mernClient.connect(db_url,{useNewUrlParser:true},(err,client)=>{
        if(err) throw err;
            else{
                //throw client object
                //database instance
                var imageId=req.params.id;
                console.log(imageId);
              //  return;
               let db= client.db(db_name);
               db.collection(collection_name).findOne({"_id":new mongodb.ObjectID(req.params.id)}),(err,res)=>{
                 if(err) throw err;
                 else{
                    // res.send(JSON.stringify(arr));
                    console.log(res);
                     res.send(res);
                 }
               }
            }
        })
});
//POst http://localhost:3002/storage2
//Sucess Query
app.get("/eventstg",(req,res) =>{

    mernClient.connect(db_url,{useNewUrlParser:true},(err,client)=>{
        if(err) res.status(400).send({"message":"Enter Correct Id"});
            else{
                //throw client object
                //database instance
                // const page = parseInt(req.query.id);
                // console.log(page);
                //   return;
                var query = require('url').parse(req.url,true).query;
                var imageId=query.id;
                console.log(imageId);
              //  return;
               let db= client.db(db_name);
            //    var flag=db.collection(collection_name).find({"uid":imageId});
            //    console.log(flag);
            //    return;
               db.collection(collection_name).find({"uid":imageId}).toArray((err,array)=>{
                   if(!array.length){
                    res.status(400).send({"message":"Enter Correct Id"})
                       //throw err;
                   }
                else{
                    res.send(array[0]);
                }
               })
            }
        })
});


//Update
//Sucess
app.put("/update/:id",upload.single('myImage'),(req,res)=>{

    var imageId=req.params.id;
    console.log(imageId);
    if(req.file){
        var img=fs.readFileSync(req.file.path);
    var encoded_img= img.toString('base64');
    // console.log(encoded_img);
    // return;
    var finalImage= {
        contentType:req.file.mimetype,
        path:req.file.path,
        image:encoded_img
    };
}
    const updates = {
       // '$push': { attendees: req.body.attendees },
       '$addToSet': { attendees: [req.body.attendees] },
        '$set':{
            
            "name": req.body.name,
            "tagline":req.body.tagline,
            "schedule":req.body.schedule,
            "desc": req.body.desc,
            "moderator":req.body.moderator,
            "category":req.body.category,
            "sub_category":req.body.sub_category,
            "rigor_rank":req.body.regor_rank,
           // "attendees":req.body.attendees,
          // '$set': { attendees: req.body.attendees },
          
           //"attendees":[req.body.attendees] ,
            "myImage": finalImage,
           // '$replaceWith': { attendees: req.body.attendees },
        },
        
        
        
      };
           

    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
        else{
          
              
            let db=client.db(db_name);
            //JSON -1 --> VALUE TO CHANGE on ID
            //JSON 2 - -->SET THE VALUE USINF $SET OPERATOR
            db.collection(collection_name).findOneAndUpdate({"uid":req.params.id},updates,(err,result)=>{
                                                                                    if(err) throw err;
                                                                                    else{
                                                                                        res.send({update:"Sucess"});
                                                                                    }
                                                                                });
        } 
    })
});


//Sucess

app.delete("/delete/:id",(req,res)=>{
    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
        else{
            const deleteQuery = { uid: req.params.id };
            let db=client.db(db_name);
            db.collection(collection_name).deleteOne(deleteQuery,(err,result)=>{

                if (err) {
                    res.status(400).send(`Error deleting listing with id ${deleteQuery.uid}!`);
                  } else {
                    console.log("1 document deleted");
                    res.send({delete:"Sucessful"});
                  }

               
            })
            
            
        }
    })
});


//Pagination
//query String

app.get("/pagination",(req,res) =>{

// To do

} )


var port = process.env.PORT || '3000'
app.listen(3004, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
});

