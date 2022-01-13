const checkAuth = require("../middleware/check-auth");
const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name price _id')//ca sa dam fetch si la product atunci cand dam la order, "product" pt ca asa e numele din model(order.js)
        //si acuma product nu o o sa mai fie doar un Id cum era inainte fara sa folosesc populate
        //o sa contina tot produsul
        //al doilea arg reprezinta campurile pe care le vrem din product
        .exec()
        .then((response) => {
            res.status(200).json({
                count: response.length,
                orders: response.map((doc) => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                }),

            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })
};

exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found!'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity:  req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })
        .then((response) => {
            res.status(200).json({
                message: "Order stored",
                createdOrder: {
                    _id: response._id,
                    product: response.product,
                    quantity: response.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + response._id
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        });
};

exports.orders_get_order =  (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then((order) => {
            if(!order) {
                res.status(404).json({
                    message: "Order not found!"
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        });
};

exports.orders_delete_order =  (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then((response) => {
            res.status(200).json({
                message: 'Order deleted!',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: "ID", quantity: "Number" }
                }
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        });
};