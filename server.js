// Initializing express
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

// Setting the port
app.set('port', (process.env.PORT || 80));

// Setup body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting up view engine
app.engine('hbs', hbs({extname: 'hbs',
                       defaultLayout: 'layout',
                       layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// --- Routing ---
// Index page
app.get(['/', '/home', '/index'], function(request, response) {
    response.render('index', {title: 'Steve Smart',
                              index: 'true',
                              css: ['index.css'],
                              js: ['index.js']});
});

// About page
app.get(['/about', '/me'], function(request, response) {
    response.render('about', {title: 'About Me',
                              about: 'true',
                              css: ['about.css'],
                              js: ['about.js']});
});

// Resume page
app.get(['/resume', '/cv'], function(request, response) {
    response.render('resume', {title: 'Resume',
                               resume: 'true',
                               css: ['resume.css'],
                               js: ['resume.js']});
});

// Main blog page
app.get(['/blog', '/journal', '/diary'], function(request, response) {
    response.render('blog', {title: 'Blog',
                             blog: 'true',
                             css: ['blog_main.css'],
                             js: ['blog_main.js']});
});

// ### Individual blog pages ###
// 1 - Introductory blog post
app.get(['/blog/1', '/journal/1', '/diary/1'], function(request, response) {
    mongodb.connect(dbURL, {useNewUrlParser: true}, function(error, client) {
        if (error) {
            response.status(500).render('errors/error500', {title: '500',
                                                            css: ['error.css']});
        }
        var db = client.db('blog_db');
        db.collection('blog_comments').find({blog_id: '1'}).sort({datetime: 1}).toArray(function(error, results) {
            if (error) {
                response.status(500).render('errors/error500', {title: '500',
                                                                css: ['error.css']});
            }
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
    mongodb.connect(dbURL, {useNewUrlParser: true}, function(error, client) {
        if (error) {
            response.status(500).render('errors/error500', {title: '500',
                                                            css: ['error.css']});
        }
        var db = client.db('blog_db');
        var xssOptions = {
            whiteList: {
                a: ["href"]
            }
        };
        var newComment = {
            blog_id: '1',
            name: sanitize(xss(request.body.name, xssOptions)),
            datetime: sanitize(xss(request.body.datetime, xssOptions)),
            date: sanitize(xss(request.body.date, xssOptions)),
            time: sanitize(xss(request.body.time, xssOptions)),
            comment: sanitize(xss(request.body.comment, xssOptions))
        };
        db.collection('blog_comments').insertOne(newComment, function(error, result) {
            if (error) {
                response.status(500).render('errors/error500', {title: '500',
                                                                css: ['error.css']});
            }
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
// ### End individual blog pages ###

// Contact page
app.get(['/contact', '/connect', '/socials'], function(request, response) {
    response.render('contact', {title: 'Contact Me',
                                contact: 'true',
                                css: ['contact.css'],
                                js: ['contact.js']});
});
// --- End Routing ---

// Setting up static file service
app.use('/', express.static(__dirname + '/public'));

// --- Error handling ---
// 404 - page not found
app.use(function(request, response) {
    response.status(404).render('errors/error404', {title: '404',
                                                  css: ['error.css']});
});

// 500 - server error
app.use(function(error, request, response, next) {
    console.log(error);
    response.status(500).render('errors/error500', {title: '500',
                                                  css: ['error.css']});
});
// --- End error handling

// Starting server
http.listen(app.get('port'), function() {
    console.log(`Server started on port ${app.get('port')}`);
});
