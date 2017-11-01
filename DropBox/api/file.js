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
      getFilesList(userId, function (err, result) {
        if(err) {
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
  if(req.session.user){
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
  }else{
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.status(401).send({'error' : 'Unauthorized access'});
  }


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

function getFilesList(userId, callback) {
  var dir = path.resolve(mainFolder + path.sep + userId);
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
  console.log('hi');
  console.log(req.session);
  //var userId = req.cookies.userId;
  if(req.session.userId){
    console.log('user is ' + req.session.user);
    var userId = req.session.userId;
    getFilesList(userId, function (err, result) {
      if(err) {
        res.status(300).send({'error' : 'No files found for user'});
      } else {
        res.status(200).send({'result' : result});
      }
    });
  }else{
    console.log("not logged in!!");
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.status(401).send({'error' : 'Unauthorized access'});
  }



  // var dir = path.resolve(mainFolder + path.sep + userId);
  // foldersFiles = [];
  // try{
  //   fs.readdir(dir, (err, files) => {
  //     if(files){
  //       files.forEach(file => {
  //         var isDir = fs.lstatSync(path.resolve(dir+path.sep+file)).isDirectory();
  //         var fileObject = {
  //           'name'  : file,
  //           'isDir' : isDir
  //         }
  //         foldersFiles.push(fileObject);
  //       });
  //       res.status(200).send({'result' : foldersFiles});
  //     }else{
  //       res.status(300).send({'error' : 'No files found for user'});
  //     }
  //   })
  // }catch(err){
  //   res.status(300).send({'error' : 'No files found for user'});
  // }
});

function getFile(req, callback) {
  var file = mainFolder + path.sep + req.query.userid + path.sep + req.query.filename;
  if(req.query.isDir) {
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
    callback(null, file);
  }
}

// Download the file
router.get('/download', function(req, res){
  console.log('entering');
  getFile(req, function(err, file) {
    if(err) {
      console.log(err);
    } else {
      var file = path.resolve(file);
      res.setHeader('Content-disposition', 'attachment; filename=' + req.query.filename);
      res.download(file);
    }
  })

  // var file = mainFolder + path.sep + req.query.userid + path.sep + req.query.filename;
  // var mimetype = mime.getType('jpg');
  // console.log(file);
  // var files = [];
  // var zipfileName = '';
  // if(req.query.isDir){
  //   var zipfileName = './tmp/'+req.query.filename+'.zip';
  //   console.log(zipfileName);
  //   zipFolder(file,zipfileName , function(err) {
  //   if(err) {
  //       console.log('oh no!', err);
  //   } else {
  //       file = path.resolve(zipfileName);
  //       console.log(file);
  //   }
  // });
  // }
  // file = path.resolve(file);
  // res.setHeader('Content-disposition', 'attachment; filename=' + req.query.filename);
  // res.download(file); // Set disposition and send it.

});

// Return Router
module.exports = router;
