const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    middleName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    school:{
        type: String,
        required: true
    },
    schoolClass:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

mongoose.model("User", userSchema)
