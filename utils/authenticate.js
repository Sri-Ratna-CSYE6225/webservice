const usersController = require('../controllers/users.controller');
const {getUserByUserName, comparePasswords} = require('../controllers/users.controller');

 function basicAuthentication() {
    // // make authenticate path public
    // if (req.path === '/users/authenticate') {
    //     return next();
    // }
return[
    // check for basic auth header
    async (req, res, next) => {
    
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    
    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    console.log('dsdsadsadsa',username, password );
    var isValid;
   await getUserByUserName(username, password).then(async (response) => {
        if(!response){
            return res.status(401).json({ message: 'Invalid Authentication Credentials' });
        }
         isValid = await comparePasswords(password, response.dataValues.password);
    });

    if (!isValid) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    } else{
        req.user = {username: username, password: password};
         next();
    }
    // attach user to request object
}
];
}


module.exports = basicAuthentication;