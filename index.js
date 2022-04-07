const express = require('express');
const bodyParser = require("body-parser");
const fs = require("fs");
const router = express.Router();
router.use(express.json());
const app = express();
const portNumber = 3000;
const userRoutes = require('./routes/userRoutes.js');
const basicAuthentication = require('./utils/authenticate');
const controller = require('./controllers/profilepics.controller');
const StatsD = require('node-statsd');

client = new StatsD({
  host: 'localhost',
  port: 8125
});
router.get("/healthz", (request,response) =>{
    client.increment('healthz api');
    response.sendStatus(200);
});
const AWS = require('aws-sdk');

// console.log('-------dsadasda----------',AWS.config.credentials);
app.use(router);
app.use('/v1/user', userRoutes);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept,x-access-token"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Request-Headers", "x-access-token");
    next();
});
app.post("/v1/user/self/pic",
  bodyParser.raw({type: ["image/jpeg", "image/png"], limit: "5mb"}),
  basicAuthentication(),
controller.createProfilePic);

  app.get("/v1/user/self/pic",
  bodyParser.raw({type: ["image/jpeg", "image/png", "image/jpg"], limit: "5mb"}),
  basicAuthentication(),
controller.getProfilePic);

app.delete("/v1/user/self/pic",
  bodyParser.raw({type: ["image/jpeg", "image/png", "image/jpg"], limit: "5mb"}),
  basicAuthentication(),
controller.deleteProfilePic);
const db = require("./db");
db.sequelize.sync();

app.get("*", function(req, res) {
    res.send("Page Not Found");
});

app.listen(portNumber, () => {
    console.log("Listening Port 3000");
});

module.exports = app;
