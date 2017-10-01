// Dependencies

var express = require('express');
var router = express.Router();
var calcController = require('../controllers/calcController.js')

// Routes
router.get('/', function(req,res){
	res.send('Testing!!');
})
router.get('/add/:op1/:op2', calcController.add);
router.get('/subtract/:op1/:op2', calcController.subtract);
router.get('/multiply/:op1/:op2', calcController.multiply);
router.get('/divide/:op1/:op2', calcController.divide);

// Return Router
module.exports = router;