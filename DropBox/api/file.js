// Dependencies
var express = require('express');
var cors = require('cors');
var router = express.Router();
var multer = require('multer');
var mainFolder = "./user_files";


// Specify where to store files
var Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, mainFolder);
     },
     filename: function(req, file, callback) {
         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
     }
});

// create multer object to save files
var upload = multer({
  storage: Storage
}).array("files", 10); // specify max number of allowed files

router.use(cors());
// Upload the given files
router.post('/upload', function(req,res){
  upload(req, res, function(err) {
    if (err) {
      console.log('error is ' + err);
      res.status(300).send({'error' : 'Files Could not be uploaded'});
    }else{
      res.status(200).send({'result' : 'File uploaded sucessfully'});
    }
  });
});

// Return Router
module.exports = router;
