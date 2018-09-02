const mongoose = require('mongoose');

var County = mongoose.model('County', {
    code: {
        type: String
    },
    name: {
        type: String
    }
});

module.exports = {County};