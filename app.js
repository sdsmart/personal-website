// Constants
const DEFAULT_PORT = 8888

// Initializing express
var path = require('path');
var hbs = require('express-handlebars')
var express = require('express');
var app = express();
var http = require('http').Server(app);

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
    response.render('blogs/1', {title: 'Introductory Blog Post',
                                blog: 'true',
                                css: ['blog_individual.css'],
                                js: ['blog_individual.js']});
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
  response.status(500).render('errors/error500', {title: '500',
                                                  css: ['error.css']});
});
// --- End error handling

// Starting server
http.listen(DEFAULT_PORT, () => {
    console.log(`Server started on port ${DEFAULT_PORT}`);
});