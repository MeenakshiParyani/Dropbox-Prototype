// Dependencies

var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
	req.session.destroy();
  res.status(200).send({
    result : 'Logged Out!!'
  });
});

// Return Router
module.exports = router;
