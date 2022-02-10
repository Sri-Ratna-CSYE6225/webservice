const express = require('express');
const bodyParser = require("body-parser");
const router = express.Router();
router.use(express.json());
const app = express();
const portNumber = 3000;

router.get("/healthz", (request,response) =>{
    response.sendStatus(200);
});

app.use(router);

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


app.get("*", function(req, res) {
    res.send("Page Not Found");
});

app.listen(portNumber, () => {
    console.log("Listening Port 3000");
});

export default router;