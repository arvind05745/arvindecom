const mongoose = require('mongoose')

const proSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "active"
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
    }, price: {
        type: String
    }, category: {
        type: String
    }
});

module.exports = mongoose.model('product', proSchema)