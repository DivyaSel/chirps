//chirps
var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    Bcrypt = require('bcryptjs');

var UserSchema = Mongoose.Schema({
    firstName: {type: String, required: true}, 			
    lastName: {type: String, required: true}, 		
    screenName: {type: String, required: true}, 		
    email: {type: String, required: true, match: /\S+@\S+\.\S+/},
    password: {type: String, required: true},
    dateRegistered: {type: Date, default: Date.now },
    follow: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}); 

UserSchema.pre('save', function (next) {
    var person = this;
    if (this.isModified('password') || this.isNew) { 
       Bcrypt.genSalt(10, function (err, salt) {
            if (err) { 
               return next(err); 
           }
            Bcrypt.hash(person.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                person.password = hash;
                next();
            });
        });
    }       else { 
                return next();
                }
}); 

UserSchema.methods.comparePassword = function (passw, cb) {
    Bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = Mongoose.model('User', UserSchema); 