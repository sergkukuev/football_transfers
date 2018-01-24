const   mongoose    = require('mongoose'),
        crypto      = require('crypto');

const Schema  = mongoose.Schema;

const UserSchema = new Schema({
    login: {
        type  : String, 
        unique: true,
        required : true
    },
    hPassword: {
        type: String, 
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date, 
        default: Date.now
    },
    code: String
});

UserSchema.statics.get = function(callback) {
    return this.find(function(err, users) {
        if (err)
            callback(err, null);
        else {
            if (users) {
                let result = [];
                for (let i = 0; i < users.length; i++)
                    result[i] = users[i];
                callback(null, result);
            }
            else
                callback(null, null);
        }
    });
}

UserSchema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest("hex");
}

UserSchema.virtual('userID').get(function(){
    return this.id;
});

UserSchema.virtual('password').set(function(password){
    this.salt = crypto.randomBytes(32).toString('base64');
    this.hPassword = this.encryptPassword(password);
});

UserSchema.methods.checkPassword = function(password){
    return this.encryptPassword(password) === this.hPassword;
}

mongoose.model('User', UserSchema);

var model = mongoose.model('User');
module.exports.userModel = model;