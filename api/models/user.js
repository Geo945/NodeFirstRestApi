const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        //unique: true will not validate the values will only increse
        // performance on queiries for example if searching after an email knowing there is only one email
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
        //if the field type is String you can add regex validation to make sure the email is valid using "match" configuration
        //the regular expresion need to be put between "/" and "/"
        password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);