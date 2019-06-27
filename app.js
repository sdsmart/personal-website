// Constants
const DEFAULT_PORT = 8888

// Initializing express
var express = require('express');
var app = express();
var http = require('http').Server(app);

// --- Routing ---
// Index page
app.get(['/', '/home', '/index'], function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

// About page
app.get(['/about', '/me'], function(request, response) {
    response.sendFile(__dirname + '/views/about.html');
});
// --- End Routing ---

// Setting up static file service
app.use('/', express.static(__dirname + '/public'));

// Starting server
http.listen(DEFAULT_PORT, () => {
    console.log(`Server started on port ${DEFAULT_PORT}`);
});