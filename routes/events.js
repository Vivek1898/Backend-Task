let express = require("express");
const router = express.Router();
let mongodb = require("mongodb");
var fs = require("file-system");
var path = require("path");
var ObjectId = require('mongodb').ObjectID;
var multer = require("multer");


//POST  -> Only POST Items with unique Id
//    -> all fields are mandatory else it returns Field not found
//http://localhost:8000/api/v3/app/events

//GET (PAGINATION) -> http://localhost:8000/api/v3/app/events?type=latest&limit=5&page=1

//GET (BY UNIQUE ID) -> If Id is present in Database then it returns item else Failure
//http://localhost:8000/api/v3/app/events?id=25811


//DELETE ->  If Id is present in Database then it returns item else Failure
// http://localhost:8000/api/v3/app/events/8527


//PUT -> If Id is present in Database then it returns item else Failure
//http://localhost:8000/api/v3/app/events/8527




//Connection and Database


let db_name = `events-db`;
let collection_name = `events`;
let db_url = `mongodb://localhost:27017/`;

let mernClient = mongodb.MongoClient;

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
//Filtering query string 
//GET (PAGINATION) -> http://localhost:8000/api/v3/app/events?type=latest&limit=5&page=1
//GET (BY UNIQUE ID) -> http://localhost:8000/api/v3/app/events?id=25811

router.get("/events", (req, res) => {
  var query1 = require("url").parse(req.url, true).query;
  var page = parseInt(query1.page);
  var limit = parseInt(query1.limit);
  //Get Paginated Data
  if (page && limit) {
    if (page < 0 || page === 0) {
      response = {
        error: true,
        message: "invalid page number, should start with 1",
      };
      return res.json(response);
    }
  //  console.log(query1.type);
    var order;
    if (query1.type === "latest") {
      order = -1;
    } else {
      order = 1;
    }
    var startFrom = limit * (page - 1);
    var perPage = limit;

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
  } else {
      //Get element with Unique Id
    mernClient.connect(db_url, { useNewUrlParser: true }, (err, client) => {
      if (err) res.status(400).send({ message: "Enter Correct Id" });
      else {
        var query = require("url").parse(req.url, true).query;
        var getID = {_id:new ObjectId(query.id)};
       console.log(getID);

        let db = client.db(db_name);

        db.collection(collection_name)
          .find(getID)
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


//POST
//http://localhost:8000/api/v3/app/events
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
    type:req.body.type,
    uid: parseInt(req.body.uid),
    name: req.body.name,
    tagline: req.body.tagline,
    schedule: req.body.schedule,
    desc: req.body.desc,
    moderator: req.body.moderator,
    category: req.body.category,
    sub_category: req.body.sub_category,
    rigor_rank: parseInt(req.body.rigor_rank),
    myImage: finalImage,

    attendees: [req.body.attendees],
    date: new Date(),
  };


  //Validation
  if (!obj.type) res.status(400).send({ message: "Type Required" });
 else if (!obj.uid)
    res.status(400).send({ message: "Enter UID (Must Be Integer Value)" });
    
  else if (!obj.name) res.status(400).send({ message: "Name Required" });
  else if (!obj.tagline) res.status(400).send({ message: "Tagline Required" });
  else if (!obj.schedule)
    res.status(400).send({ message: "Schedule (Date+Time) Required" });
  else if (!obj.desc) res.status(400).send({ message: "Description Required" });
  else if (!obj.moderator)
    res.status(400).send({ message: "Moderator Name Required" });
  else if (!obj.category)
    res.status(400).send({ message: "Enter category !!" });
    else if (!obj.sub_category)
    res.status(400).send({ message: "Enter category !!" });
  else if (!obj.rigor_rank)
    res
      .status(400)
      .send({ message: "Enter Rigor_rank (Must Be Integer Value)" });
  else if (!obj.myImage)
    res.status(400).send({ message: "Upload Event Image " });

    //Connection
  else {
    mernClient.connect(db_url,  { useNewUrlParser: true }, async  (err, client) => {
      if (err) throw err;
      else {
       // console.log("Connection Sucess");
        let db = client.db(db_name);
        
        //Enter Only Unique Ids 
        const userExist= await  db.collection(collection_name)
        .findOne({ uid: parseInt(req.body.uid) });
        if (userExist) return res.status(400).send("Id Already Exist !! Enter Unique Id");
        
     
        else{
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
       
      }
    });
  }

  //Validation
});

//Update
//http://localhost:8000/api/v3/app/events/8527


router.put("/events/:id", upload.single("myImage"), (req, res) => {
  var imageId = parseInt(req.params.id);
 // console.log(imageId);
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
     type:req.body.type,
     uid: parseInt(req.body.uid),
      name: req.body.name,
      tagline: req.body.tagline,
      schedule: req.body.schedule,
      desc: req.body.desc,
      moderator: req.body.moderator,
      category: req.body.category,
      sub_category: req.body.sub_category,
      rigor_rank: parseInt(req.body.rigor_rank),

      myImage: finalImage,
      date: new Date(),
    },

    $push: {
      attendees: req.body.attendees,
    },
  };

  mernClient.connect(db_url,async (err, client) => {
    if (err) res.status(400).send(`Db Connection Error!`);
    else {
      let db = client.db(db_name);

      //Update Only if user Exists
    const userExist= await  db.collection(collection_name)
          .findOne({_id:new ObjectId(req.params.id)});
          if (!userExist) return res.status(400).send("Id Not Exist !! Enter Correct Id to Update");
       
          //Upating array of attendees
     else if (req.body.attendees != null) {
        db.collection(collection_name).update(
          {_id:new ObjectId(req.params.id)},
          {
            $set: {
              attendees: [],
            },
          },
          { multi: true },
          (err, result, next) => {
            if (err)  res.status(400).send(`Error updating likes on listing with id ${listingQuery.id}!`);
            else {
              console.log("Sucess");
            }
          }
        );
      }
      //Final Update
      db.collection(collection_name).findOneAndUpdate(
        {_id:new ObjectId(req.params.id)},
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


//@Delete 
// http://localhost:8000/api/v3/app/events/8527
router.delete("/events/:id", (req, res) => {
  mernClient.connect(db_url, async (err, client) => {
    if (err) throw err;
    else {
      const deleteQuery = {_id:new ObjectId(req.params.id)};
      let db = client.db(db_name);
      // Delete Only if user exist
      const userExist= await  db.collection(collection_name)
          .findOne({_id:new ObjectId(req.params.id)});

          if (!userExist) return res.status(400).send("Id Not Exist !! Enter Correct Id to Delete");
      db.collection(collection_name).deleteOne(deleteQuery, (err, result) => {
        if (err) {
          res
            .status(400)
            .send(`Error deleting listing with id ${deleteQuery._id}!`);
        } else {
        //  console.log("1 document deleted");
          res.send({ delete: "Sucessful" });
        }
      });
    }
  });
});
module.exports = router;



