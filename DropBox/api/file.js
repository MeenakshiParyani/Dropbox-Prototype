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
var mysql = require('./mysql');

router.use(cors());
// Upload the given files
router.post('/upload', function(req,res){
  console.log(req.headers);
  var userId = req.headers.userid;
  var folderPath = req.headers.path;
  var dir = mainFolder + path.sep + userId + path.sep + folderPath;
  var filename = '';
  // Specify where to store files
  var Storage = multer.diskStorage({
       destination: function(req, file, callback) {
           filename = file.fieldname + "_" + Date.now() + "_" + file.originalname;
           console.log('filename is ' + filename);
           callback(null, dir);
       },
       filename: function(req, file, callback) {
           saveFileFolderToDB(filename, dir, 0, userId);
           callback(null, filename);
       }
  });
  // create multer object to save files
  var upload = multer({
    storage: Storage
  }).array("files", 10);// specify max number of allowed files
  upload(req, res, function(err) {
    if (err) {
      console.log('error is ' + err);
      res.status(300).send({'error' : 'Files Could not be uploaded'});
    }else{
      res.status(200).send({'result' : 'File uploaded sucessfully'});
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
  createDirectory(userId,folderPath, 1, function(success){
      if(success){
        res.status(200).send({'result' : 'Folder created sucessfully'});
      }else{
        res.status(300).send({'error' : 'Folder could not be created'});
      }
  });

});

function createDirectory(userId, folderPath, saveDir, callback){
  var dir = mainFolder + path.sep + userId + path.sep + folderPath;
  var absoluteDir = path.resolve(dir);
  var folder = dir.substring(dir.lastIndexOf(path.sep) + 1);
  var folderPath = dir.substring(0,dir.lastIndexOf(path.sep));
  console.log(dir);
  mkdirp(absoluteDir, function (err) {
    if (err){
      console.error(err);
      callback(false,dir);
    }
    else {
      console.log('Folder created!');
      if(saveDir)
        saveFileFolderToDB(folder, folderPath, 1, userId);
      callback(true,dir);
    }
  });
}

// Save file to database
function saveFileFolderToDB(fileName, filePath, isDir, ownerId){
  console.log('Saving file to db');
  var insertFile="INSERT INTO `files` (`file_name`, `file_path`, `is_dir`, `owner_id`)" +
			" VALUES ('"+ fileName + "', '" + filePath + "', '" + isDir + "', '" + ownerId + "');";
  console.log(insertFile);
  try{
		mysql.fetchData(function(err,results){
			if(err){
				return false;
			}else{
				return true;
			}
		},insertFile);
	}catch(err){
		return false;
	}
}

router.get('/list', function(req,res){
  var userId = req.query.userid;
  var dir = path.resolve(mainFolder + path.sep + userId);
  foldersFiles = [];
  try{
    fs.readdir(dir, (err, files) => {
      if(files){
        files.forEach(file => {
          var isDir = fs.lstatSync(path.resolve(dir+path.sep+file)).isDirectory();
          var fileObject = {
            'name'  : file,
            'isDir' : isDir
          }
          foldersFiles.push(fileObject);
        });
        res.status(200).send({'result' : foldersFiles});
      }else{
        res.status(300).send({'error' : 'No files found for user'});
      }
    })
  }catch(err){
    res.status(300).send({'error' : 'No files found for user'});
  }
});


// Return Router
module.exports = router;
