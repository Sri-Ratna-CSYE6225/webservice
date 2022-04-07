const usersController = require('../controllers/users.controller');
const {getUserByUserName, comparePasswords} = require('../controllers/users.controller');
const logger = require('../utils/logger');
 function basicAuthentication() {
return[
    // check for basic auth header
    async (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        logger.error("missing authorization header");
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    
    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    var isValid;
   await getUserByUserName(username, password).then(async (response) => {
        if(!response){
            logger.error("Invalid Credentials");
            return res.status(401).send({message: "Invalid Credentials!"});
        }
         isValid = await comparePasswords(password, response.dataValues.password);
    }).catch((err) => {
        logger.error({"Error while getting user" : err});
    });

    if (!isValid) {
        logger.error("Invalid Credentials");
        return res.status(401).send({message: "Invalid Credentials!"});
    } else{
        req.user = {username: username, password: password};
        req.body = req.body
        logger.info("Authentication Successful");
         next();
    }
}
];
}


module.exports = basicAuthentication;