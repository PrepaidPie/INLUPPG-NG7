const db = require('mongoose');
const encrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.register = function(req, res) {    
    User
        .find({ email: req.body.email })
        .exec()
        .then(function(user) {
            if(user.length > 0) {
                return res.status(400).json({
                    message: `En användare med eposten ${req.body.email} finns redan.`,
                    statuscode: 400
                })
            }
            else {
                encrypt.hash(req.body.password, 10, function(error, hash) {
                    if(error) {
                        return res.status(500).json({ 
                            error: error,
                            message: ` ${req.body.email}`
                        });
                    }
                    else {
                        let user = new User(
                            {
                                _id:                    new db.Types.ObjectId,
                                firstName:              req.body.firstName,
                                surName:                req.body.surName,
                                email:                  req.body.email,
                                password:               hash,
                                birthDate:              req.body.birthDate,
                                address:                req.body.address,
                                postalcode:             req.body.postalcode,
                                city:                   req.body.city,
                                country:                req.body.country,
                                dAddress:               req.body.dAddress,
                                dPostalcode:            req.body.dPostalcode,
                                dCity:                  req.body.dCity,
                                dCountry:               req.body.dCountry

                            }
                        );
                        user
                            .save()
                            .then(function() {
                                res.status(201).json({
                                   message: `Användare ${req.body.firstName} ${req.body.lastName} skapades.`,
                                   statuscode: 201,
                                   success: true 
                                })
                            })
                            .catch(function(error) {
                                res.status(500).json({
                                    message: `Kunde ej skapa användare ${req.body.firstName} ${req.body.lastName}.`,
                                    statuscode: 500,
                                    success: false
                                })
                            })
                    }
                })
            }
        }) 
}

exports.login = function(req, res) {
    User
        .find({ email: req.body.email })
        .then(function(user) {
            if(user.length === 0) {
                return res.status(401).json({
                    message: "E-post eller lösenord är inkorrekt",
                    statuscode: 401,
                    success: false
                })
            } 
            else {
                encrypt.compare(req.body.password, user[0].password, function(error, result) {
                    if(error) {
                        return res.status(401).json({
                            message: "E-post eller lösenord är inkorrekt",
                            statuscode: 401,
                            success: false
                        })
                    }

                    if(result) {
                        const token = jwt.sign(
                            { id: user[0]._id, email: user[0].email },
                            process.env.PRIVATE_SECRET_KEY,
                            { expiresIn: "1h" }
                        )

                        return res.status(200).json({
                            message: "Värdena stämmer",
                            success: true,
                            token: token,
                            id: user[0]._id,
                            email: user[0].email
                        })
                    }

                    return res.status(401).json({
                        message: "E-post eller lösenord är inkorrekt",
                        statuscode: 401,
                        success: false
                    })
                })
            }       
        })
}

exports.getUser = function(req, res) {
    User
        .find({ _id: req.params.id })
        .then((data) => res.status(200).json(data))
}

exports.updateUser = function(req, res) {
    if( req.body.password.length > 0 ) {
        console.log("Bytte Lösenord")
        encrypt.hash(req.body.password, 10, function(error, hash) {
            if(error) {
                return res.status(500).json({
                    error: error,
                    message: "Ett fel uppstod"
                })
            }
            else {
                User
                .updateOne({ _id:req.params.id },
                {$set: {
                    firstName: req.body.firstName,
                    surName: req.body.surName,
                    email: req.body.email,
                    password: hash,
                    birthDate: req.body.birthDate,
                    address: req.body.address,
                    postalcode: req.body.postalcode,
                    city: req.body.city,
                    country: req.body.country,
                    dAddress: req.body.dAddress,
                    dPostalcode: req.body.dPostalcode,
                    dCity: req.body.dCity,
                    dCountry: req.body.dCountry
                }})
                .then( result => {
                    res.json({succes: true});
                })
                .catch(function(error, affected, resp) {
                    console.log(error);
                })
            }
        });
    } else {
        User
        .updateOne({ _id:req.params.id },
        {$set: {
            firstName: req.body.firstName,
            surName: req.body.surName,
            email: req.body.email,
            password: hash,
            birthDate: req.body.birthDate,
            address: req.body.address,
            postalcode: req.body.postalcode,
            city: req.body.city,
            country: req.body.country,
            dAddress: req.body.dAddress,
            dPostalcode: req.body.dPostalcode,
            dCity: req.body.dCity,
            dCountry: req.body.dCountry
        }})
        .then( result => {
            res.json({succes: true});
        })
        .catch(function(error, affected, resp) {
            console.log(error);
        })
    }
}