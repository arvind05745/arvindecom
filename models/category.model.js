const mongoose = require('mongoose')

const catSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Active"
    },
    addedOn: {
        type: Date,
        default: new Date()
    },
    addedBy: {
        type: String
    },
    picture: {
        type: String
    }
})

module.exports = mongoose.model('category', catSchema)