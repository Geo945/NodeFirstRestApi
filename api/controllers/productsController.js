const Product = require("../models/product");
const mongoose = require("mongoose");

exports.products_get_all = (req, res, next) => {
    //can use Product.find().limit or roduct.find().where to modify the query
    Product.find()
        .select('name price _id productImage')//defined what fields I want to select from DB
        .exec()
        .then((response) => {
            const metaData = {
                count: response.length, //to give some meta information about the amount of data We fetched
                products: response.map( (doc) => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            //if(response.length >= 0) {
            res.status(200).json(metaData);
            //} else {
            //    res.status(404).json({message: "No entries found"})
            // }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error: error});
        });

};


exports.products_create_product =  (req, res, next) => {
    console.log(req.file);//I can access req.file because I executed upload.single() first
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path//multer has path property which contains the path to the file
    });

    product.save()
        .then((result) => {
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products' + result._id
                    }
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });

};

exports.products_get_product =  (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then((response) => {
            if(response) {//if the ID sent by the request is invalid, response will be null
                //so we want to send status 200 only when ID is invalid or the response is not null
                res.status(200).json({
                    product: response,
                    request: {
                        type: 'GET',
                        description: 'GET_ALL_PRODUCTS',
                        url: 'http://localhost:3000/products'
                    }
                });
            }else{
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                })
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for( const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps })
        .exec()
        .then((response) => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error: error});
        });
    //first argument is the object id we want to update
    //second argument describes how we want to update this
};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
        .exec()
        .then((response) => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({error: error});
        })//this means remove any objects in the database that fullfills  this criteria
};