const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //ref contains a string with the name of the model you want to connect this model to
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    //default : 1 so if the quantity is not >0 we will automatically put it to 1
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);