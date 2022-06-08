const eventsRoute = require('./routes/events');
const express = require('express');
let cors=require("cors");
let bodyParser=require("body-parser")
const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use(express.json());
app.use('/api/v3/app', eventsRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));