// Dependencies
var path = require('path');
var fs = require('fs');

// app variables
var mainFolder = "./user_files";
function handle_request(msg, callback){
    var res = {};
    var userId = msg.userid;
    var currentpath = msg.path;
    console.log("In handle request:"+ JSON.stringify(msg));
    console.log(userId + ' wow ' + currentpath);

    getFilesList(userId, currentpath, function(err, results){
      if(err){
        console.log(err);
        callback(err, null);
      }else{
        res.code = "200";
        res.files = results;
        callback(null, res);
      }
    });
}

function getFilesList(userId, currentpath, callback) {
  var dir = path.resolve(mainFolder + path.sep + userId + path.sep + currentpath);
  console.log('dir is ' + dir);
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
          console.log(fileObject);
          foldersFiles.push(fileObject);
        });
        callback(null, foldersFiles);
      } else{
        console.log('no files');
        callback({'error' : 'No files found for user'}, null);
      }
    });
  } catch(err){
    console.log(err);
    callback(err, null);
  }
}

exports.handle_request = handle_request;
