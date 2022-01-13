const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

exports.user_signup =  (req, res, next) => {
    User.find({email: req.body.email })
        .exec()
        .then((user) => {
            if(user.length >= 1){//find returneaza un array de user
                //deci daca user.length < 1 atunci nu exista user deci e ok
                //altfel emailul deja e folosit
                //code 409 means conflict
                //422 means unprocessable entity
                return res.status(409).json({
                    message: 'Mail exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    //2 arg of bcrypt.hash: a salt parameter means we add random strings to that password before we hash it, it is a number of salting rounds
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        //if not error we have a hash password
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then((response) => {
                                console.log(response);
                                res.status(201).json({
                                    message: 'User created'
                                })
                            })
                            .catch((error) => {
                                console.log(error);
                                res.status(500).json({
                                    error: error
                                })
                            });
                    }
                })
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        });

};

exports.user_login = (req, res , next) => {
    User.find({ email: req.body.email })
        .exec()
        .then((user) => {
            if(user.length < 1){
                //401 means unauthorized
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            //if we are here then the email is valid
            //now check the password
            //bcrypt has a way to check if two password match even if the hash is not the same
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                //error
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                //result = true if it succeed or else false
                if (result) {
                    //1 arg (payload) - what we want to pass to the client
                    //2 arg - a private key
                    //3 arg - expiration time of the token
                    //4 arg - a callback that gets the token, can ommit the callback whit: const token = jwt.sign(...)
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        });
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }

                //incorrect password
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        });
};

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId})
        .exec()
        .then((response) => {
            console.log(response);
            res.status(200).json({
                message: 'User deleted'
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                error: error
            })
        });
};