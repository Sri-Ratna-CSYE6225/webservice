const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
router.use(express.json());
const app = express();
const portNumber = 3000;
const userRoutes = require('./routes/userRoutes.js');
const basicAuthentication = require('./utils/authenticate');
router.get("/healthz", (request,response) =>{
    response.sendStatus(200);
});

app.use(router);
app.use('/v1/user', userRoutes);
// app.use(basicAuthentication);
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
const db = require("./db");
db.sequelize.sync();

app.get("*", function(req, res) {
    res.send("Page Not Found");
});

app.listen(portNumber, () => {
    console.log("Listening Port 3000");
});

module.exports = app;