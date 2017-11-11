// Dependencies
var express = require('express');
var cors = require('cors');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var mime = require('mime');
var zipFolder = require('zip-folder');
var kafka = require('../kafka/client');

// app variables
var mainFolder = "./user_files";
var mysql = require('./mysql');

//router.use(cors());
// Upload the given files
router.post('/upload', function(req,res){
  console.log('--------req-----');
  console.log(req.headers.currentpath);
  var userId = req.session.userId;
  var folderPath = req.headers.currentpath;
  var dir = mainFolder + path.sep + userId + path.sep + folderPath;
  var filename = '';
  console.log(userId + ' ' + folderPath + ' ' + dir );
  // Specify where to store files
  var Storage = multer.diskStorage({
       destination: function(req, file, callback) {
           console.log('Doing~!!!');
           filename = file.fieldname + "_" + Date.now() + "_" + file.originalname;
           console.log('filename is ' + filename);
           mkdirp(dir, function(err){
             if(err)
              console.log(err);
             else
              callback(null, dir);
           });

       },
       filename: function(req, file, callback) {
          //  saveFileFolderToDB(filename, dir, 0, userId);
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
      //res.status(200).send({'result' : 'File uploaded sucessfully'});
      getFilesList(userId, folderPath, function (err, result) {
        if(err) {
          console.log(err);
          res.status(300).send({'error' : 'No files found for user'});
        } else {
          //res.status(200).send({'result' : result});
          res.status(200).send({
            result : 'File uploaded sucessfully',
            files : result
          });
        }
      });
    }
  });

});


// Create a new directory
router.post('/newFolder', function(req,res){
  var currentpath = req.headers.currentpath;
  var folderName = req.headers.foldername;
  var userId = req.session.userId;
  console.log(currentpath + ' ' + userId);
  if(userId){
    console.log(req.body);
    currentpath = currentpath.replace('/', path.sep);
    currentpath = currentpath.replace('\\', path.sep);
    console.log("path recieved is " + currentpath);
    console.log("folder yo be created is " + folderName);
    createDirectory(userId, currentpath, folderName, 1, function(err, results){
      if(err) {
        console.log(err)
        res.status(300).send({'error' : 'Could not create the directory'});
      }else{
        res.status(200).send({'result':results});
      }
    });
  }else{
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.status(401).send({'error' : 'Unauthorized access'});
  }


});

function createDirectory(userId, currentPath, folderName, saveDir, callback){
  console.log('currentpath ' + currentPath);
  console.log('folderName' + folderName);
  var dir = mainFolder + path.sep + userId + path.sep + currentPath;
  var absoluteDir = path.resolve(dir + path.sep + folderName);
  console.log('dir ' + dir);
  console.log('folder ' + folderName);
  console.log('currentPath ' + currentPath);
  console.log('absoluteDir ' + absoluteDir);
  mkdirp(absoluteDir, function (err) {
    if (err){
      console.error(err);
      callback(err,null);
    }
    else {
      console.log('Folder created!');
      getFilesList(userId, currentPath, function(err,files){
        callback(err,files);
      })
      // {
      // if(saveDir)
      //  saveFileFolderToDB(folder, folderPath, 1, userId);
      // }
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

function getFilesList(userId, currentpath, callback) {
  var dir = path.resolve(mainFolder + path.sep + userId + path.sep + currentpath);
  console.log('getting file list from ' + dir);
  var foldersFiles = [];
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
        callback(null, foldersFiles);
      } else{
        callback({'error' : 'No files found for user'}, null);
      }
    });
  } catch(err){
    callback(err, null);
  }
}

router.get('/list', function(req,res){
  console.log(req.session);
  var currentpath = req.headers.currentpath;
  var userId = req.session.userId;
  console.log('In Listing Files ' + currentpath + ' ' + userId);
  if(!userId) {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.status(401).send({'error' : 'Unauthorized access'});
  }else{
    kafka.make_request('list_topic',{"userid":userId,"path":currentpath}, function(err,results){
        console.log('in result');
        console.log(results);
        if(err) {
          res.status(300).send({'error' : 'No files found for user'});
        }else{
          res.status(200).send({'result':results});
        }
    });
  }
});

router.get('/download', function(req, res){
   var file = mainFolder + path.sep + req.query.userid + path.sep + req.query.filename;
   debugger;
   console.log('entering');
   var mimetype = mime.getType('jpg');
   getFile(req, function(err, file) {
     console.log(file);
     if(err) {
       var file = path.resolve(file);
       console.log(err);
       res.setHeader('Content-disposition', 'attachment; filename=' + req.query.filename);
     } else {
       res.setHeader('Content-type', mimetype);
       var file = path.resolve(file);
       res.download(file);
     }
   });
 });

function getFile(req, callback) {
  var file = mainFolder + path.sep + req.query.userid + path.sep + req.query.filename;
  console.log('user is ' + req.query.userid + ' ' + req.query.filename + ' ' + req.query.isDir);
  if(req.query.isDir=='true') {
    console.log('downloading directory');
    var zipfileName = './tmp/'+req.query.filename+'.zip';
    console.log(zipfileName);
    zipFolder(file,zipfileName , function(err) {
      if(err) {
        console.log('oh no!', err);
        callback(err, null);
      } else {
        callback(null, zipfileName);
      }
    });
  } else {
    console.log('downloading file');
    callback(null, file);
  }
}

// Return Router
module.exports = router;
