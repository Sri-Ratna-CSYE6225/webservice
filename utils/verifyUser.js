const logger = require('./logger')
var aws = require("aws-sdk");
const SESConfig = {
    apiVersion: "2010-12-01",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    accessSecretKey: process.env.AWS_SECRET_KEY,
    region: "us-east-1"
}
aws.config.update({
    SESConfig
});
var dynamo = new aws.DynamoDB({
    region: 'us-east-1'
});
var DynamoDB = new aws.DynamoDB.DocumentClient({
    service: dynamo
});
const db = require('../db');
const User = db.users;

const verifyUser = (req, res) => {
    console.log(req, res);

    const parsedUrl = req._parsedUrl.query;
    const username = parsedUrl.split("=")[1].split("&")[0];
    const token = parsedUrl.split("token=")[1];

    let searchParams = {
        TableName: "dynamodb-table",
        Key: {
            "one-time-token": token
        }
    };


    DynamoDB.get(searchParams, function (error, record) {
        if (error) {
            logger.info({
                msg: "Error in DynamoDB get method ",
                error: error
            });
            console.log("Error in DynamoDB get method ", error);
            return res.status(400).json({
                status: 400,
                error: error
            });
        } else {
            let isTokenValid = false;
            console.log("Checking if record already present in DB!!");
            if (record.Item == null || record.Item == undefined) {
                logger.info({
                    msg: "No record in Dynamo ",
                    record: record
                });
                isTokenValid = false;
            } else {
                if (record.Item.ttl < Math.floor(Date.now() / 1000)) {
                    logger.info({
                        msg: "ttl expired ",
                        record: record
                    });
                    isTokenValid = false;
                } else {
                    logger.info({
                        msg: "ttl found ",
                        record: record
                    });
                    isTokenValid = true;
                }
            }
            if (isTokenValid) {
            User.update({ 
            verify: true
        }, {where : {username: username}}).then((result) => {
            if(result == 1){
                res.sendStatus(204);
                logger.info("User updated successfully");
            } else {
                res.sendStatus(400);
                logger.error("Error updating user");
            }
        }).catch(err => {
            res.status(500).send({
                message: "Error updating user"
              });
              logger.info({"Error updating user": err});
        });
            } else {
                logger.info('User cannot be verified as token expired');
                return res.status(400).json({
                    status: 400,
                    description: 'Token Expired'
                });
            }
        }
    })

}

exports.verifyUser = verifyUser;