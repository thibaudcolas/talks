var gulp = require('gulp');
var path = require('path');
var open = require('open');
var express = require('express');
var lr = require('tiny-lr');

var server = lr();
var app = express();

var APP_ROOT = __dirname;
var APP_PORT = 4000;

// Opens a browser with the application path.
gulp.task('open', ['serve'], function() {
    open('http://localhost:' + APP_PORT);
});

// Statically serves files and adds the LiveReload script.
gulp.task('serve', function() {
    app.use(require('connect-livereload')());
    app.use(express.static(APP_ROOT));
    app.listen(APP_PORT);
});

// Watches for file changes and reloads browser pages.
gulp.task('watch', function() {
    server.listen(35729, function(err) {
        if (err) {
            return console.log(err);
        }

        gulp.watch([
            'index.html',
            'css/custom.css'
        ], function(evt) {
            server.changed({
                body: {
                    files: [path.relative(APP_ROOT, evt.path)]
                }
            });
        });
    });
});

// Default developer working task.
gulp.task('work', ['watch', 'open']);

gulp.task('default', ['work']);
