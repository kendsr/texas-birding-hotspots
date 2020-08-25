 const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

module.exports = {
    mongoose
}