const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    process.env.PORT = 3000;
    // process.env.DB_URI = 'mongodb://localhost:27017/Birding';
    process.env.DB_URI = 'mongodb+srv://kendsr:need2not@testcluster.fmbay.mongodb.net/Birding?retryWrites=true&w=majority';
} 