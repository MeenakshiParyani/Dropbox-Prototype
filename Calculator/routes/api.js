// Dependencies

var express = require('express');
var cors = require('cors');
var router = express.Router();
var calcController = require('../controllers/calcController.js')

// Routes
router.get('/', function(req,res){
	res.send('Testing!!');
});

router.use(cors());
router.get('/operate/:op1/:op2/:operator', calcController.operate);

// Return Router
module.exports = router;
