
var express = require("express");
// export const getEventById2 = async (req,res)=>{

// }

export const addEvent =  (req, res, next) => {
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
  };

export const allEvent =  (req, res) => {
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
// export const deleteEvent = async (req,res)=>{

// }
// export const getEventById = async (req,res)=>{

// }
export const getPaginateData =  (req, res) => {
    var query1 = require("url").parse(req.url, true).query;
    var pageNo = parseInt(query1.pageNo);
    var size = parseInt(query1.size);
  
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
  };