/*
=================================================================
 (                              (       *             (            
 )\ )  *   )                    )\ )  (  `     (      )\ )  *   )  
(()/(` )  /( (    (   (   (    (()/(  )\))(    )\    (()/(` )  /(  
 /(_))( )(_)))\   )\  )\  )\    /(_))((_)()\((((_)(   /(_))( )(_)) 
(_)) (_(_())((_) ((_)((_)((_)  (_))  (_()((_))\ _ )\ (_)) (_(_())  
/ __||_   _|| __|\ \ / / | __| / __| |  \/  |(_)_\(_)| _ \|_   _|  
\__ \  | |  | _|  \ V /  | _|  \__ \ | |\/| | / _ \  |   /  | |    
|___/  |_|  |___|  \_/   |___| |___/ |_|  |_|/_/ \_\ |_|_\  |_|
=================================================================
*/

// ------------------
// Requiring packages
// ------------------
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var hbs = require('express-handlebars')
var bodyParser = require('body-parser');
var sanitize = require('mongo-sanitize');
var xss = require('xss');
var mongodb = require('mongodb').MongoClient;
var dbURL = "mongodb://localhost:27017/blog_db";

// ----------------
// Setting the port
// ----------------
app.set('port', (process.env.PORT || 5000));

// ----------------------------------
// Setting up the body-parser package
// ----------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------------------
// Setting up the express-handlebars package
// -----------------------------------------
app.engine('hbs', hbs({extname: 'hbs',
                       defaultLayout: 'layout',
                       layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// =============
// Begin routing
// =============

// -----------
// Index route
// -----------
app.get(['/', '/home', '/index'], function(request, response) {
    response.render('index', {title: 'Steve Smart',
                              index: 'true',
                              css: ['index.css'],
                              js: ['index.js']});
});

// -----------
// About route
// -----------
app.get(['/about', '/me'], function(request, response) {
    response.render('about', {title: 'About Me',
                              about: 'true',
                              css: ['about.css'],
                              js: ['about.js']});
});

// ------------
// Resume route
// ------------
app.get(['/resume', '/cv'], function(request, response) {
    response.render('resume', {title: 'Resume',
                               resume: 'true',
                               css: ['resume.css'],
                               js: ['resume.js']});
});

// ---------------
// Blog main route
// ---------------
app.get(['/blog', '/journal', '/diary'], function(request, response) {
    response.render('blog', {title: 'Blog',
                             blog: 'true',
                             css: ['blog_main.css'],
                             js: ['blog_main.js']});
});

// ======================
// Begin blog post routes
// ======================

// ---------------------------------
// #1: Introductory blog post routes
// ---------------------------------
app.get(['/blog/1', '/journal/1', '/diary/1'], function(request, response) {

    // Connecting to local mongodb service
    mongodb.connect(dbURL, {useNewUrlParser: true}, function(error, client) {
        if (error) {
            response.status(500).render('errors/error500', {title: '500',
                                                            css: ['error.css']});
        }

        // Grabbing db object
        var db = client.db('blog_db');

        // Selecting relevant blog comments
        db.collection('blog_comments').find({blog_id: '1'}).sort({datetime: 1}).toArray(function(error, results) {
            if (error) {
                response.status(500).render('errors/error500', {title: '500',
                                                                css: ['error.css']});
            }

            // Sending response back to the client
            response.render('blogs/1', {title: 'Introductory Blog Post',
                                        blog: 'true',
                                        css: ['blog_individual.css'],
                                        js: ['blog_individual.js'],
                                        specialHeadData: [
                                            '<meta name="google-signin-client_id" content="498828023330-5f3jg27hrono046m11hoabtcq35ars3u.apps.googleusercontent.com">'
                                        ],
                                        comments: results});
        });
    });
});

app.post(['/blog/1'], function(request, response) {

    // Connecting to local mongodb service
    mongodb.connect(dbURL, {useNewUrlParser: true}, function(error, client) {
        if (error) {
            response.status(500).render('errors/error500', {title: '500',
                                                            css: ['error.css']});
        }

        // Grabbing db object
        var db = client.db('blog_db');

        // Setting XSS prevention options
        var xssOptions = {
            whiteList: {
                a: ["href"]
            }
        };

        // Generating new comment object from post params
        var newComment = {
            blog_id: '1',
            name: sanitize(xss(request.body.name, xssOptions)),
            datetime: sanitize(xss(request.body.datetime, xssOptions)),
            date: sanitize(xss(request.body.date, xssOptions)),
            time: sanitize(xss(request.body.time, xssOptions)),
            comment: sanitize(xss(request.body.comment, xssOptions))
        };

        // Inserting new comment into db
        db.collection('blog_comments').insertOne(newComment, function(error, result) {
            if (error) {
                response.status(500).render('errors/error500', {title: '500',
                                                                css: ['error.css']});
            }

            // Sending updated comment data back to client
            db.collection('blog_comments').find({blog_id: '1'}).sort({datetime: 1}).toArray(function(error, results) {
                if (error) {
                    response.status(500).render('errors/error500', {title: '500',
                                                                    css: ['error.css']});
                }
                response.send(results);
            });
        });
    });
});

// ====================
// End blog post routes
// ====================

// -------------
// Contact route
// -------------
app.get(['/contact', '/connect', '/socials'], function(request, response) {
    response.render('contact', {title: 'Contact Me',
                                contact: 'true',
                                css: ['contact.css'],
                                js: ['contact.js']});
});

// ===========
// End routing
// ===========

// ------------------------------
// Setting up static file service
// ------------------------------
app.use('/', express.static(__dirname + '/public'));

// ====================
// Begin Error handling
// ====================

// --------------------------
// Error 404 - Page not found
// --------------------------
app.use(function(request, response) {
    response.status(404).render('errors/error404', {title: '404',
                                                  css: ['error.css']});
});

// ---------------------------------
// Error 500 - Internal server error
// ---------------------------------
app.use(function(error, request, response, next) {
    console.log(error);
    response.status(500).render('errors/error500', {title: '500',
                                                  css: ['error.css']});
});

// ==================
// End Error handling
// ==================

// ---------------
// Starting server
// ---------------
http.listen(app.get('port'), function() {
    console.log(`Server started on port ${app.get('port')}`);
});
