// Dependencies
var express = require('express');
var router = express.Router();
var kafka = require('../kafka/client');
var User = require('../models/user.js');
// app variables
var mainFolder = "./user_files";

router.post('/addUserGroup', function(req, res){
   var userId = req.session.userId;
   var groupName = req.body.groupName;
   console.log('adding group ' + userId + ' ' + groupName);
   saveGroupToDB(userId, groupName);
   //, function(err, groups) {
   //   console.log(file);
   //   if(err) {
   //     var file = path.resolve(file);
   //     console.log(err);
   //     res.setHeader('Content-disposition', 'attachment; filename=' + req.query.filename);
   //   } else {
   //     res.setHeader('Content-type', mimetype);
   //     var file = path.resolve(file);
   //     res.download(file);
   //   }
   // }
 });




function saveGroupToDB(ownerId, group){
  var myquery = { _id: ownerId };
  var newvalues = { $push: { groups: [group] } };
  var newvalues =  { groups: [group] } ;
  User.updateGroups(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    console.log(res);
  });
}

module.exports = router;
