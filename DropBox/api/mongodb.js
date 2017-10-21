module.exports = {
        url : 'mongodb://localhost:27017/dropbox',
        options : {
		  db: { native_parser: true },
		  server: { poolSize: 5 }
		}
 }
