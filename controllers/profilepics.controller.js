const db = require('../db');
const bcrypt = require('bcrypt');
const {v4:uuidv4} = require('uuid');
const Profile = db.profilepics;
const {getUserByUserName} = require('./users.controller');
const fs = require("fs");
const AWS = require('aws-sdk');
const moment = require("moment");
const StatsD = require('node-statsd');
const logger = require('../utils/logger');
client = new StatsD({
    host: 'localhost',
    port: 8125
});
async function getEC2Rolename(AWS){
    var promise = new Promise((resolve,reject)=>{
        
        var metadata = new AWS.MetadataService();
        
        metadata.request('/latest/meta-data/iam/security-credentials/',function(err,rolename){
            if(err){ 
                logger.error({"Error in getting Role name": err});
                reject(err); }           
            resolve(rolename);
        });
    });
        
    return promise;
};

function getEC2Credentials(AWS,rolename){
    var promise = new Promise((resolve,reject)=>{
        
        var metadata = new AWS.MetadataService();
        
        metadata.request('/latest/meta-data/iam/security-credentials/'+rolename,function(err,data){
            if(err) {
                logger.error({"Error in getting Role name": err});
                reject(err);
            }
            resolve(JSON.parse(data));            
        });
    });
        
    return promise;
};
// function getEC2Credentials(AWS,rolename){
//     var promise = new Promise((resolve,reject)=>{
        
//         var metadata = new AWS.MetadataService();
        
//         metadata.request('/latest/meta-data/iam/security-credentials/'+rolename,function(err,data){
//             if(err) reject(err);   
            
//             resolve(JSON.parse(data));            
//         });
//     });
        
//     return promise;
// };

async function setCred(){
    getEC2Rolename(AWS)
    .then((rolename)=>{
        console.log('------------role--------', rolename);
        return getEC2Credentials(AWS,rolename)
     
    })
    .then((credentials)=>{
        AWS.config.update({region:'us-east-1'});
        console.log('------------crede--------', credentials);
        var s3 = new AWS.S3({
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            region: 'us-east-1'
        });
})
    .catch((err)=>{
        console.log(err);
    });

}
async function createProfilePic(req, res, next){
    var s3;
    client.increment('add-profile-pic-api');
    getEC2Rolename(AWS)
    .then((rolename)=>{
        logger.info("Successfully recieved role name");
        return getEC2Credentials(AWS,rolename);
    })
    .then(async(credentials)=>{
        logger.info("Successfully recieved credentials");
        AWS.config.update({region:'us-east-1'});
        s3 = new AWS.S3({
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            region: 'us-east-1'
        });
        var fileData;
    const user = await getUserByUserName(req.user.username);
        
        fs.writeFile("./uploads/image.jpeg", req.body, async (error) => {
          if (error) {
              console.log(error);
              logger.error({"Error in writing files to upload folder" : error});
            throw error;
          }
          const fileContent = fs.readFileSync("./uploads/image.jpeg");
          const params = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: `${user.id}/profile.jpeg`,
              Body: fileContent
          };
        
          await s3.upload(params, async function(err, data) {
              if (err) {
                logger.error({"Error in uploading files to S3 bucket" : err});
                  throw err;
              }
              fileData = data;
        var profile_pic = {
            file_name: fileData.key,
            id:uuidv4(),
            url:fileData.Location,
            upload_date: moment().format("YYYY/MM/DD"),
            user_id:user.id
        }
        Profile.create(profile_pic)
        .then(data => {
          res.status(201).send({
            file_name: data.file_name,
            id:data.id,
            url:data.url,
            upload_date: data.upload_date,
            user_id:data.user_id
          });
          logger.info("Successfully updated image to S3 bucket");
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while uploading image."
          });
          logger.error({"Error in uploading image to S3 bucket" : err});
          });
        });
    });
      
    });
    
    }

async function getProfilePic(req, res, next){
    client.increment('get-profile-pic-api');
    const user = await getUserByUserName(req.user.username);
    const profile = await getProfilePicByUserId(user.id);
    if(profile){
        res.status(200).send({
            file_name: profile.dataValues.file_name,
            id:profile.dataValues.id,
            url:profile.dataValues.url,
            upload_date: profile.dataValues.upload_date,
            user_id:profile.dataValues.user_id
        });
        logger.info("Retrieved image details successfully");
    } else {
        res.sendStatus(404);
        logger.error("Image not found");
    }    
}

async function deleteProfilePic(req, res, next){
    var s3;
    client.increment('delete-profile-pic-api');
    getEC2Rolename(AWS)
    .then((rolename)=>{
        logger.info("Successfully recieved role name for delete");
        return getEC2Credentials(AWS,rolename)
     
    })
    .then(async(credentials)=>{
        AWS.config.update({region:'us-east-1'});
        logger.info("Successfully recieved credentials for delete");
        s3 = new AWS.S3({
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            region: 'us-east-1'
        });
    const user = await getUserByUserName(req.user.username);
    const profile = await getProfilePicByUserId(user.id);
    if(!profile){
        res.sendStatus(404);
        logger.error("Profile pic doesn't exist");
    }
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${user.id}/profile.jpeg`
    };
    await s3.deleteObject(params, (error, data) => {
        if (error) {
          res.status(400).send(error);
          logger.error({"Error in deleting S3 object" : error});
        }
        else{
          Profile.destroy({where:{id: profile.id}});
          res.sendStatus(204);
          logger.info("Successfully deleted S3 object");
        }
      }).promise();
    });
}
async function getProfilePicByUserId(userId){
    return Profile.findOne({where : {user_id: userId}});
  }

  module.exports = {
      createProfilePic : createProfilePic,
      getProfilePic: getProfilePic,
      deleteProfilePic: deleteProfilePic
  }