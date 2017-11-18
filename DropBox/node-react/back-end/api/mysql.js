var mysql = require('mysql');
var database = 'dropbox';


var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : database,
		connectionLimit : 10000,
});

//Put your mysql configuration settings - user, password, database and port
function getConnection(){
	console.log(pool);
	var connection = pool.getConnection(function(err, connection) {
				if(err)
			  	console.log('err is ' +err);
				//else
					//console.log(connection);
        return connection;
    });
		return connection;

}


function fetchData(callback,sqlQuery){

	console.log("\nSQL Query::"+sqlQuery);

	var connection= pool.getConnection(function(err, connection) {
			if(err)
		  	console.log('err is ' +err);
			connection.query(sqlQuery, function(err, rows, fields) {
				if(err){
					console.log("ERROR: " + err);
		      callback(err);
				}
				else
				{	// return err or result
					console.log("DB Results:"+rows);
					callback(err, rows);
				}
			});
  });
}

exports.fetchData=fetchData;
exports.database=database;
exports.pool = pool;
