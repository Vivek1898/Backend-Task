
let express=require("express");
const router = express.Router();
let mongodb=require("mongodb")
var fs = require("file-system");
var path = require("path");

var multer = require("multer");

//Connection and Database



let mernClient=mongodb.MongoClient;


//Defining Storage for multer

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  var upload = multer({ storage: storage });





//get Paginated Data
router.get("/events", (req, res) => {
    var query1 = require("url").parse(req.url, true).query;
    var pageNo = parseInt(query1.pageNo);
    var size = parseInt(query1.size);

    if(pageNo && size){
        if (pageNo < 0 || pageNo === 0) {
            response = {
              error: true,
              message: "invalid page number, should start with 1",
            };
            return res.json(response);
          }
          console.log(query1.type);
          var order;
          if (query1.type === "latest") {
            order = -1;
          } else {
            order = 1;
          }
          var startFrom = size * (pageNo - 1);
          var perPage = size;
        
          mernClient.connect(db_url, (err, client) => {
            if (err) throw err;
            else {
              let db = client.db(db_name);
              db.collection(collection_name)
                .find()
                .sort({ date: order })
                .skip(startFrom)
                .limit(perPage)
                .toArray((err, arr) => {
                  if (err) throw err;
                  else {
                    res.send(arr);
                  }
                });
            }
          });
    }else{
        mernClient.connect(db_url, { useNewUrlParser: true }, (err, client) => {
            if (err) res.status(400).send({ message: "Enter Correct Id" });
            else {
              var query = require("url").parse(req.url, true).query;
              var imageId = query.id;
              console.log(imageId);
        
              let db = client.db(db_name);
        
              db.collection(collection_name)
                .find({ uid: imageId })
                .toArray((err, array) => {
                  if (!array.length) {
                    res.status(400).send({ message: "Enter Correct Id" });
                    //throw err;
                  } else {
                    res.send(array[0]);
                  }
                });
            }
          });
    }
  
   
  });
  
 
  
  //Sucess
  router.post("/events", upload.single("myImage"), (req, res, next) => {
    if (req.file) {
      var img = fs.readFileSync(req.file.path);
      var encoded_img = img.toString("base64");
      // console.log(encoded_img);
      // return;
      var finalImage = {
        contentType: req.file.mimetype,
        path: req.file.path,
        image: encoded_img,
      };
    }
    var obj = {
      uid: req.body.uid,
      name: req.body.name,
      tagline: req.body.tagline,
      schedule: req.body.schedule,
      desc: req.body.desc,
      moderator: req.body.moderator,
      category: req.body.category,
      sub_category: req.body.sub_category,
      rigor_rank: req.body.regor_rank,
  
      myImage: finalImage,
  
      attendees: [req.body.attendees],
      date: new Date(),
    };


    //Validation


  
    mernClient.connect(db_url, { useNewUrlParser: true }, (err, client) => {
      if (err) throw err;
      else {
        console.log("Connection Sucess");
        let db = client.db(db_name);
  
        db.collection(collection_name).insertOne(obj, (err, result) => {
          if (err) throw err;
          else {
            console.log(`Added a new match with id ${result.insertedId}`);
            res.send({
              insert: `Added a new match with id ${result.insertedId}`,
            });
          }
        });
      }
    });
  });
  

  
  //Update
  //Sucess
  router.put("/events/:id", upload.single("myImage"), (req, res) => {
    var imageId = req.params.id;
    console.log(imageId);
    if (req.file) {
      var img = fs.readFileSync(req.file.path);
      var encoded_img = img.toString("base64");
  
      var finalImage = {
        contentType: req.file.mimetype,
        path: req.file.path,
        image: encoded_img,
      };
    }
  
    const updates = {
      $set: {
        name: req.body.name,
        tagline: req.body.tagline,
        schedule: req.body.schedule,
        desc: req.body.desc,
        moderator: req.body.moderator,
        category: req.body.category,
        sub_category: req.body.sub_category,
        rigor_rank: req.body.rigor_rank,
  
        myImage: finalImage,
        date: new Date(),
      },
  
      $push: {
        attendees: req.body.attendees,
      },
    };
  
    mernClient.connect(db_url, (err, client) => {
      if (err) throw err;
      else {
        let db = client.db(db_name);
        if (req.body.attendees != null) {
          db.collection(collection_name).update(
            { uid: req.params.id },
            {
              $set: {
                attendees: [],
              },
            },
            { multi: true },
            (err, result, next) => {
              if (err) throw err;
              else {
                console.log("Arr");
              }
            }
          );
        }
        db.collection(collection_name).findOneAndUpdate(
          { uid: req.params.id },
          updates,
          {},
          (err, result) => {
            if (err) throw err;
            else {
              res.send({ update: "Sucess" });
            }
          }
        );
      }
    });
  });
  
  //Sucess
  
  router.delete("/events/:id", (req, res) => {
    mernClient.connect(db_url, (err, client) => {
      if (err) throw err;
      else {
        const deleteQuery = { uid: req.params.id };
        let db = client.db(db_name);
        db.collection(collection_name).deleteOne(deleteQuery, (err, result) => {
          if (err) {
            res
              .status(400)
              .send(`Error deleting listing with id ${deleteQuery.uid}!`);
          } else {
            console.log("1 document deleted");
            res.send({ delete: "Sucessful" });
          }
        });
      }
    });
  });
module.exports = router;