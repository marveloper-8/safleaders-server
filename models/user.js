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
    parentFirstName:{
        type: String,
        required: true
    },
    parentLastName:{
        type: String,
        required: true
    },
    parentMiddleName:{
        type: String,
        required: true
    },
    parentEmail:{
        type: String,
        // required: true
    },
    parentPhone:{
        type: Number,
        required: false
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
    schoolDepartment:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
})

mongoose.model("User", userSchema)