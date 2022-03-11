const db = require('../db');
const bcrypt = require('bcrypt');
const {v4:uuidv4} = require('uuid');
const Profile = db.profilepics;
const {getUserByUserName} = require('./users.controller');
const fs = require("fs");
const AWS = require('aws-sdk');
const moment = require("moment");
var s3;
async function getEC2Rolename(AWS){
    var promise = new Promise((resolve,reject)=>{
        
        var metadata = new AWS.MetadataService();
        
        metadata.request('/latest/meta-data/iam/security-credentials/',function(err,rolename){
            if(err) reject(err);
            console.log(rolename);            
            resolve(rolename);
        });
    });
        
    return promise;
};

function getEC2Credentials(AWS,rolename){
    var promise = new Promise((resolve,reject)=>{
        
        var metadata = new AWS.MetadataService();
        
        metadata.request('/latest/meta-data/iam/security-credentials/'+rolename,function(err,data){
            if(err) reject(err);   
            
            resolve(JSON.parse(data));            
        });
    });
        
    return promise;
};
function getEC2Credentials(AWS,rolename){
    var promise = new Promise((resolve,reject)=>{
        
        var metadata = new AWS.MetadataService();
        
        metadata.request('/latest/meta-data/iam/security-credentials/'+rolename,function(err,data){
            if(err) reject(err);   
            
            resolve(JSON.parse(data));            
        });
    });
        
    return promise;
};

async function setCred(){
    getEC2Rolename(AWS)
    .then((rolename)=>{
        console.log('------------role--------', rolename);
        return getEC2Credentials(AWS,rolename)
     
    })
    .then((credentials)=>{
        AWS.config.update({region:'us-east-1'});
        console.log('------------crede--------', credentials);
        s3 = new AWS.S3({
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
    getEC2Rolename(AWS)
    .then((rolename)=>{
        console.log('------------role--------', rolename);
        return getEC2Credentials(AWS,rolename)
     
    })
    .then(async(credentials)=>{
        AWS.config.update({region:'us-east-1'});
        console.log('------------crede--------', credentials);
        s3 = new AWS.S3({
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
            region: 'us-east-1'
        });
        var fileData;
    const user = await getUserByUserName(req.user.username);
        
        fs.writeFile("./uploads/image.jpeg", req.body, async (error) => {
            console.log(req.body)
          if (error) {
              console.log(error)
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
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
          });
        });
    });
      
    });
    
    }

async function getProfilePic(req, res, next){
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
    } else {
        res.sendStatus(404);
    }    
}

async function deleteProfilePic(req, res, next){
    const user = await getUserByUserName(req.user.username);
    const profile = await getProfilePicByUserId(user.id);
    if(!profile){
        res.sendStatus(404);
    }
    Profile.destroy({where:{id: profile.id}});
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: profile.file_name
    };
    s3.deleteObject(params, (error, data) => {
        if (error) {
          res.status(400).send(error);
        }
        res.sendStatus(204);
        Profile.destroy({where: {id: profile.id}});
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