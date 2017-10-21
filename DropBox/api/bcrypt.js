var bcrypt = require('bcrypt');
const saltRounds = 10;

function encrypt(plainText, callback){
  console.log('got password ' + plainText);
  bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(plainText, salt, function(err, hash) {
          if(err){
            console.log('err is----' + err);
            callback(err, null);
          }else{
            console.log('encrypted ' + hash);
            callback(null, hash);
          }
      });
  });
}

function compareHash(plainTextPassword, hash, callback){
  bcrypt.compare(plainTextPassword, hash, function(err, res) {
    console.log('plain ' + plainTextPassword);
    console.log('hash ' + hash);
    if(err){
      console.log('err is----' + err);
      callback(err, null);
    }else{
      console.log('comparing ' + res);
      callback(null, res);
    }
  });
}

exports.encrypt = encrypt;
exports.compareHash = compareHash;
