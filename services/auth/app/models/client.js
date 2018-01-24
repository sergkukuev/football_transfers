const mongoose  = require('mongoose');

const Schema  = mongoose.Schema;

var Client = new Schema({
    name: {
      type: String, 
      unique: true,
      required: true
    },
    appId: {
      type: String, 
      required: true
    },
    appSecret: {
      type: String,
      required: true
    }
});

mongoose.model('Client', Client);

var ClientModel = mongoose.model('Client');
module.exports.model = ClientModel;