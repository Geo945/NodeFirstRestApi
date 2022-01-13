const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

//to connect to the database:
mongoose.connect('mongodb+srv://geo:' + process.env.MONGO_DB_PW +'@node-first-rest-api.boz79.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;
//don't need to specify the option bc it is using MongoClient: true by default
/*mongoose.connect('mongodb+srv://geo:' + process.env.MONGO_DB_PW +'@node-first-rest-api.boz79.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {useMongoClient: true}
);*/


//for morgan(logging requests)
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));//to make uploads folder public available for images
//true allows you to parse extended bodys with complex data in it
//for body parser:
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//to accept request from a backend
//adding headers to the response
//so were ever I sent a response it has this headers
app.use((req, res, next) => {
    //res.header('Access-Control-Allow-Origin','http://myurl');
    //the second parameter is the url who should have access
    res.header('Access-Control-Allow-Origin','*'); //* to accept all
    //alte pagini web nu pot accesa api-ul meu daca pun al doilea arg doar url meu
    //doar poate fi accesat de diferite tool-uri asadar nu e o securitate buna

    //so allow the headers could be appended to an incoming request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if( req.method === 'OPTIONS'){
        //browsers will always send an OPTIONS request first when you send
        //a post request or a get request
        //to tell the browser what type of request to accept:
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).json({});
    }
    next(); //so the proper request can take over if we dont return in OPTIONS
});

//a request has to go through app.use
//so everything which has /products will be fired to products.js
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//if a request makes it passed the two app.use functions above
//this is an invalid request and we can handle the error
app.use((req, res, next) => {
   const error = new Error('Not found!');
   error.status = 404;
   next(error);//this will forward the request(the error request instead of the beginning one)
});



//this will handle all the errors:
//if the request irl is valid the app.use from above will not be called
//so when we have an error like invalid email etc in the products.js or orders.js
//we can handle all of them with the below function app.use()
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;