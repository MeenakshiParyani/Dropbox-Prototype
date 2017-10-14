// Dependencies
var express = require('express');
var cors = require('cors');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

// app variables
var mainFolder = "./user_files";


router.use(cors());
// Upload the given files
router.post('/upload', function(req,res){
  console.log(req.headers);
  var userId = req.headers.userid;
  var folderPath = req.headers.path;
  createDirectory(userId, folderPath, function(success,dir){
    if(success){ // success creating the folder
      // Specify where to store files
      var Storage = multer.diskStorage({
           destination: function(req, file, callback) {
               callback(null, dir);
           },
           filename: function(req, file, callback) {
               callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
           }
      });
      // create multer object to save files
      var upload = multer({
        storage: Storage
      }).array("files", 10); // specify max number of allowed files
      upload(req, res, function(err) {
        if (err) {
          console.log('error is ' + err);
          res.status(300).send({'error' : 'Files Could not be uploaded'});
        }else{
          res.status(200).send({'result' : 'File uploaded sucessfully'});
        }
      });
    }else{ // If folder could not be created
      res.status(300).send({'error' : 'Files Could not be uploaded'});
    }
  });
});


// Create a new directory
router.post('/newFolder', function(req,res){
  console.log(req.body);
  var userId = req.body.userID;
  var folderPath = req.body.path.replace('/', path.sep);
  folderPath = req.body.path.replace('\\', path.sep);
  console.log("path recieved is " + folderPath);
  createDirectory(userId,folderPath, function(success){
      if(success){
        res.status(200).send({'result' : 'Folder created sucessfully'});
      }else{
        res.status(300).send({'error' : 'Folder could not be created'});
      }
  });

});

function createDirectory(userId, folderPath, callback){
  var dir = path.resolve(mainFolder + path.sep + userId + path.sep + folderPath);
  console.log(dir);
  mkdirp(dir, function (err) {
    if (err){
      console.error(err);
      callback(false,dir);
    }
    else {
      console.log('pow!');
      callback(true,dir);
    }
  });
}

function





// Return Router
module.exports = router;
