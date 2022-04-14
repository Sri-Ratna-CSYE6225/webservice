const logger = require('../utils/logger');
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
function updateAWSConfig(AWS){
    getEC2Rolename(AWS)
    .then((rolename)=>{
        logger.info("Successfully recieved role name");
        return getEC2Credentials(AWS,rolename);
    })
    .then(async(credentials)=>{
        logger.info("Successfully recieved credentials");
        AWS.config.update({region:'us-east-1',
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey});
    });
}

module.exports = updateAWSConfig;