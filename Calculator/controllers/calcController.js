var self = this;

exports.operate = function(req, res){
	var operator = req.params.operator;
	console.log('opearator is ' + req.params.operator + req.params.op1 + req.params.op2);
	switch(operator){
		case 'add' : self.add(req,res);break;
		case 'sub' : self.subtract(req,res);break;
		case 'div' : self.divide(req,res);break;
		case 'mul' : self.multiply(req,res);
	}
}

exports.add = function(req, res){
	var result, response;
	try{
		var op1 = parseInt(req.params.op1);
		var op2 = parseInt(req.params.op2);
		result = op1 + op2;
		res.send({'result' : result});
	}catch(err){
		res.send({'error' : err});
	}
	return response;
}


exports.subtract = function(req, res){
	var result;
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
			result = '∞';
		else
			result = op1 / op2;
		res.send({'result' : result});
	}catch(err){
		console.log('Error is' + err);
		res.send({'error' : err.message});
	}
}
