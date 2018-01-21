const mongoose  = require('mongoose');

const Schema  = mongoose.Schema;

var ClientSchema = new Schema({
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

mongoose.model('Client', ClientSchema);

var model = mongoose.model('Client');
module.exports.clientModel = model;