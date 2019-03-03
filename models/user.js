var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    validator = require("validator"),
    jwt = require("jsonwebtoken"),
    _ = require("lodash"),
    bcrypt = require("bcryptjs");

mongoose.Promise = global.Promise;

var userSchema = mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique : true,
        validate : {
          validator : validator.isEmail,
          message : "{VALUE} is not an Email"
        } 
      },
    password : {
        type: String,
        default : false
      },
    tokens :[{
      access : {
        type : String,
        required : true
      },
      token : {
        type : String,
        required : true
      }
    }]
});

userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['username', '_id']);
}

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = "auth";
  var token = jwt.sign({_id : user._id.toHexString(), access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);
  
  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
  }catch(e){
    return Promise.reject();
  };

  return User.findOne({
    _id : decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  });
};

userSchema.statics.findByCredentials = function(username, password){
  var User = this;

  return User.findOne({username}).then((user) => {
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve, rejest) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user);
        } else{
          reject();
        }
      });
    });
  });
}

userSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull: {
      tokens :{
        token : token
     }
    }
  });
};

userSchema.pre('save', function(next){
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash( user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    })
  } else{
    next();
  }
});

module.exports = mongoose.model('User', userSchema);