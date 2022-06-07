
let express=require("express");
const router = express.Router();
let mongodb=require("mongodb")



let password=`admin`;
let db_name=`mern-db`;
let collection_name=`employees`
let db_url=`mongodb+srv://admin:${password}@cluster0.x0us0.mongodb.net/${db_name}?retryWrites=true&w=majority`


let mernClient=mongodb.MongoClient;
function paginatedResults() {
    return async (req, res, next) => {
      
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skipIndex = (page - 1) * limit;
      const results = {};
  
      try {
        results.results = await arr.find()
          .sort({ _id: 1 })
          .limit(limit)
          .skip(skipIndex)
          .exec();
        res.paginatedResults = results;
        next();
      } catch (e) {
        res.status(500).json({ message: "Error Occured" });
      }
    };
}

router.get("/events",(req,res) =>{

    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
            else{
                //throw client object
                //database instance
                router.get("/events",(req,res) =>{

    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
            else{
                var pageNo = parseInt(req.query.pageNo)
                var size = parseInt(req.query.size)
                var query = {}
                if(pageNo < 0 || pageNo === 0) {
                      response = {"error" : true,"message" : "invalid page number, should start with 1"};
                      return res.json(response)
                }
                query.skip = size * (pageNo - 1)
                query.limit = size
                //throw client object
                //database instance
               let db= client.db(db_name);
               db.collection(collection_name).find({},{},query,
              function (err, result) {
                 if (err) {
                    response = {"error" : true,"message" : "Error fetching data"};
                } else {
                    response = {"error" : false,"message" : data};
                 }
                 res.json(response.paginatedResults);
               })
            }
        })
});
               let db= client.db(db_name);
               db.collection(collection_name).find({}).limit(50)
               .toArray(function (err, result) {
                 if (err) {
                   res.status(400).send("Error fetching listings!");
                } else {
                   res.json(result);
                 }
               })
            }
        })
});
router.get("/eventsog",(req,res) =>{

    mernClient.connect(db_url,(err,client)=>{
        if(err) throw err;
            else{
                //throw client object
                //database instance
               let db= client.db(db_name);
               db.collection(collection_name).find({}).then(function (err, result) {
                 if (err) {
                   res.status(400).send("Error fetching listings!");
                } else {
                   res.json(result);
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