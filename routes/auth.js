const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')

router.post('/signup', (req, res) => {
    const {
        firstName,
        lastName,
        middleName,
        email,
        phone,
        parentFirstName,
        parentLastName,
        parentMiddleName,
        parentEmail,
        parentPhone,
        address,
        school,
        schoolClass,
        schoolDepartment,
        password
    } = req.body
    if(
        !firstName || 
        !lastName || 
        !middleName || 
        !email || 
        !phone || 
        !parentFirstName || 
        !parentLastName || 
        !parentMiddleName || 
        !parentEmail || 
        !parentPhone || 
        !address ||  
        !school || 
        !schoolClass || 
        !schoolDepartment || 
        !password
        ){
        return res.status(422).json({error: "Please add all the fields"})
    }
    User.findOne({email: email})
        .then((savedUser) => {
            if(savedUser){
                return res.status(422).json({error: "User already exists with that email"})
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        firstName,
                        lastName,
                        middleName,
                        email,
                        phone,
                        parentFirstName,
                        parentLastName,
                        parentMiddleName,
                        parentEmail,
                        parentPhone,
                        address,
                        school,
                        schoolClass,
                        schoolDepartment,
                        password: hashedPassword,

                    })
                    user.save()
                        .then(user => {
                            res.json({message: "Saved successfully"})
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error: "Please add email or password"})
    }
    User.findOne({email:email})
        .then(savedUser => {
            if(!savedUser){
                return res.status(422).json({error: "Invalid email or password"})
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if(doMatch){
                        // return res.json({message: "Successfully logged in"})
                        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                        const {
                            _id, 
                            firstName,
                            lastName,
                            middleName,
                            email,
                            phone,
                            parentFirstName,
                            parentLastName,
                            parentMiddleName,
                            parentEmail,
                            parentPhone,
                            address,
                            school,
                            schoolClass,
                            schoolDepartment
                        } = savedUser
                        return res.json({token, user:{
                            _id, 
                            firstName,
                            lastName,
                            middleName,
                            email,
                            phone,
                            parentFirstName,
                            parentLastName,
                            parentMiddleName,
                            parentEmail,
                            parentPhone,
                            address,
                            school,
                            schoolClass,
                            schoolDepartment
                        }})
                    }
                    else{
                        return res.status(422).json({error: "Invalid email or password"})
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

module.exports = router