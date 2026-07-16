const mongoose = require('mongoose')

const questioScheima = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    }, 
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true })

const listingSchema = new mongoose.Schema({
    price: {
        type: Number,
    required: true,
    min: 0,
    },
    image: {
        type: String,
        default:' https://images.pexels.com/photos/37419422/pexels-photo-37419422.jpeg',
        
    },
    streetAddres:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
        size:{
        type: Number,
        required: true,
        min: 0, 
    },
    owner: {
        // to specfie it blong to the User
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    favoritedBy:{},

// timestamp is for detecting time
}, { timestamps: true })

const listing = mongoose.model('listen' , listingSchema)

module.exports = listing