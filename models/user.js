const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    email: {
        type: String, // type of data
        required: true, // makes sure email is unique and there can only be one in database
        trim: true, // removes any whitespace before or after the string
        unique: true, // makes sure that email is provided
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// authenticate input against database documents
// we are creating a custom function with mongoose
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({email})
      .exec(function (error, user) {
          if (error) {
              return callback(error);
          } else if (!user) {
              const err = new Error("User not found. ");
              err.status = 401;
              callback(err);
          }
          bcrypt.compare(password, user.password, function(error, matches) {
              if (matches){
                  callback(null, user); // node use a standard rule for callbacks, an error followed by other args, in this case there is no error therefore it is null
              } else {
                  callback();
              }
          });
      });
};

// hash password before saving to database
UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

const User =  mongoose.model('User', UserSchema);
module.exports = User;