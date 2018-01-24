const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;

var AccessToken = new Schema({
    userID: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    lastUse : {
        type: Date,
        default : Date.now
    }
});

AccessToken.statics.getByUserId = function(data, callback) {
    return this.find({userID: data}, function(err, tokens) {
        if (err)
            callback(err, null);
        else {
            if (tokens) {
                let result = [];
                for (let i = 0; i < tokens.length; i++)
                    result[i] = tokens[i];
                callback(null, result);
            }
            else
                callback(null, null);
        }
    });
}

mongoose.model('AccessToken', AccessToken);

var model = mongoose.model('AccessToken');
module.exports.tokenModel = model;