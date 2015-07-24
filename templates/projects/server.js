var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path'); 

// Initialize variables. 
var port = process.env.PORT || 8080; 

// Configure morgan module to log all requests.
app.use(morgan('dev')); 

// Set the app folder to serve public assets.
app.use(express.static(__dirname + '<%= startDir %>'));

// Set up our one route to the index.html file.
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '<%= startPage %>'));
});

// Start the app.  
app.listen(port);
console.log('Listening on port ' + port + '...'); 