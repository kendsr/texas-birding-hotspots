const mongoose = require('mongoose');

var HotSpot = mongoose.model('HotSpot', {
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    hotspot: {
        type: String,
        required: true
    },
    location: {
        type: String
    }
});

module.exports = {HotSpot};