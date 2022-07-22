const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    addedOn:{
        type:Date,
        default:Date.now()
    },
    status:{
       type:String,
       default:"Active"
    }
})

module.exports = mongoose.model("user", userSchema)