const {authenticateUser} = require('../controllers/users.controller');

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
    const user =  authenticateUser(username, password );
    if (!user) {
        return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }

    // attach user to request object
    req.user = user

    next();
}
];
}


module.exports = basicAuthentication;