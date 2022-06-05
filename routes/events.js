
let express=require("express");
const router = express.Router();
let mongodb=require("mongodb")



let password=``;
let db_name=``;
let collection_name=``
let db_url=`mongodb+srv://admin:${password}@cluster0.x0us0.mongodb.net/${db_name}?retryWrites=true&w=majority`


let mernClient=mongodb.MongoClient;


router.get("/events",(req,res) =>{

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


router.post("/events/new",(req,res) =>{
    
    //JSON obj based on client data
    let obj={
       //ADD Data

    }; 
    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
        else{
            let db=client.db(db_name);
            db.collection(collection_name).insertOne(obj,(err,result)=>{
                if(err) throw err;
                else{
                    res.send({insert:"Sucess"});
                }
            })
        }
    })
});

// based on ID
router.put("/events",(req,res)=>{
    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
        else{
            let db=client.db(db_name);
            db.collection(collection_name).updateOne({"id":req.body.id},{$set:{//TO UPDATE
                                                                                }},(err,result)=>{
                                                                                    if(err) throw err;
                                                                                    else{
                                                                                        res.send({update:"Sucess"});
                                                                                    }
                                                                                });
        } 
    })
});



//Delete Request
//BASED ON ID
router.delete("/events",(req,res)=>{
    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
        else{
            let db=client.db(db_name);
            db.collection(collection_name).deleteOne({"id":req.body.id},(err,result)=>{
                if(err) throw error;
                else{
                res.send({delete:"Sucessful"});
                }
            })
            
            
        }
    })
})
module.exports = router;