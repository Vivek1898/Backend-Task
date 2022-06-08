var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
const eventsRoute = require('./routes/events');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/v3/app', eventsRoute);


var port = process.env.PORT || 8000;
app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server listening on port", port);
});
