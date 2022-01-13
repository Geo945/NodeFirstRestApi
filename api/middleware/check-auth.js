const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //verify will verify the token and then decode the token and return it
    //jwt.decode will only decode the token
    //1 arg - the token to verify
    //2 arg - the secret key passed with the token
    //3 arg - options
    //4 arg - callback function
    //or we can pass only the first two args
    //verify will throw an error if it fails so we add an try catch
    try {
        //token: "Bearer token_here" with split we split by " "(white space)
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;//added a new field to the request, so we can use it in feature requests
        //we want to call next if we did successfully auth
        //to go to the next req
        next();
    } catch (error) {
        //401 - unauthorized
        return res.status(401).json({
            message: 'Auth failed'
        })
    }


};
