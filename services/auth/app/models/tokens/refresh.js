const mongoose  = require('mongoose');
const Schema  = mongoose.Schema;

var RToken = new Schema({
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
});

RToken.statics.getAll = function(callback) {
    return this.find(function(err, tokens) {
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

mongoose.model('RefreshToken', RToken);

var TokenModel = mongoose.model('RefreshToken');
module.exports.model = TokenModel;