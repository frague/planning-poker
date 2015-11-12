require('es6-promise').polyfill();

// Include gulp
var gulp = require('gulp');
var rimraf = require('rimraf');
var gutil = require('gulp-util');

var bower = require('gulp-bower');

// Include Our Plugins
var jshint = require('gulp-jshint');

var es = require('event-stream');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');

gulp.task('bower', bower);

gulp.task('copy', function () {
    return gulp.src('app/views/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
    return gulp.src('bower_components/mdi/fonts/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

// Lint Task
gulp.task('lint', function () {
    return gulp.src('app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build_sass', function () {
    return gulp
        .src('app/sass/*.sass')
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('dist/css'))
});

// Concatenate, prefix and minify CSS
gulp.task('styles', ['build_sass'], function () {
    return gulp.src([
            'bower_components/angular-full/angular-csp.css',
            'bower_components/angular-material/angular-material.css',
            'bower_components/mdi/css/materialdesignicons.min.css',
            'dist/css/styles.css'
        ])
        .pipe(minifyCSS())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist/css'));
});

// Concatenate JS
gulp.task('scripts:merge', function () {
    return gulp.src([
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/angular-full/angular.min.js',
            'bower_components/angular-full/angular-route.min.js',
            'bower_components/angular-full/angular-resource.min.js',
            'bower_components/angular-full/angular-animate.min.js',
            'bower_components/angular-full/angular-aria.min.js',
            'bower_components/angular-full/angular-messages.min.js',
            'bower_components/angular-http-loader/app/package/js/angular-http-loader.min.js',
            'bower_components/ng-lodash/build/ng-lodash.min.js',
            'bower_components/socket.io.client/dist/socket.io-*.js',
            'bower_components/ng-socket/ngSocket.js',
            'bower_components/angular-material/angular-material.min.js',
            'app/*.js'
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('app/*.js', ['lint', 'scripts:merge']);
    gulp.watch('app/sass/*.sass', ['styles']);
    gulp.watch('app/views/*.html', ['copy']);
});

// Uglify scripts for publishing
gulp.task('publish', ['default'], function () {
    return gulp.src('dest/js/scripts.js')
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist'));
});

// Default Task
gulp.task('default', function () {
    rimraf('dest', function () {
        runSequence('bower', 'lint', 'fonts', 'styles', 'scripts:merge', 'copy');
    })
});
