const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
// const autoIncrement = require('mongoose-auto-increment');
const url  = "mongodb://127.0.0.1:27017/kart?gssapiServiceName=mongodb";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

// autoIncrement.initialize(mongoose.connection);
module.exports  = mongoose;