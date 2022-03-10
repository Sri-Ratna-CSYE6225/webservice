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
router.get("/healthz", (request,response) =>{
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
controller.createProfilePic
  // (req, res) => {
  //   try {
  //     console.log('----username-----', req.user.username);
  //     fs.writeFile("./uploads/image.jpeg", req.body, (error) => {
  //         console.log(req.body)
  //       if (error) {
  //           console.log(error)
  //         throw error;
  //       }
  //       const fileContent = fs.readFileSync("./uploads/image.jpeg");
  //       const params = {
  //           Bucket: process.env.S3_BUCKET_NAME,
  //           Key: 'profile.jpeg',
  //           Body: fileContent
  //       };
  //       s3.upload(params, function(err, data) {
  //           if (err) {
  //               throw err;
  //           }
  //           console.log(`File uploaded successfully. ${data.Location}`);

  //       }).then(() => {

  //       });
  //     });

  //     res.sendStatus(200);
  //   } catch (error) {
  //     res.sendStatus(500);
  //   }
  );

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