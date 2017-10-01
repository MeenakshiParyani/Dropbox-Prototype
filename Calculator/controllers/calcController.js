
exports.add = function(req, res){
	var result;
	// console.log('req is' + req);
	try{
		var op1 = parseInt(req.params.op1);
		var op2 = parseInt(req.params.op2);
		result = op1 + op2;
		res.send({'result' : result});
	}catch(err){
		res.send({'error' : err});
	}

}


exports.subtract = function(req, res){
	var result;
	// console.log('req is' + req);
	try{
		var op1 = parseInt(req.params.op1);
		var op2 = parseInt(req.params.op2);
		result = op1 - op2;
		res.send({'result' : result});
	}catch(err){
		res.send({'error' : err});
	}

}


exports.multiply = function(req, res){
	var result;
	// console.log('req is' + req);
	try{
		var op1 = parseInt(req.params.op1);
		var op2 = parseInt(req.params.op2);
		result = op1 * op2;
		res.send({'result' : result});
	}catch(err){
		res.send({'error' : err});
	}

}


exports.divide = function(req, res){
	var result;
	console.log('req is' + req.params.op1 + ' ' + req.params.op2);
	var op1 = parseInt(req.params.op1);
	var op2 = parseInt(req.params.op2);
	try{
		if(op2 == 0)
			throw Error('Can not Divide By 0');
		result = op1 / op2;
	}catch(err){
		console.log('Error is' + err);
		res.send({'error' : err.message});
	}
	res.send({'result' : result});
}