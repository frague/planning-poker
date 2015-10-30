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

// Lint Task
gulp.task('lint', function () {
    return gulp.src('app/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build_sass', function () {
    return gulp
        .src('app/sass/*.sass')
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('dist'))
});

// Concatenate, prefix and minify CSS
gulp.task('styles', ['build_sass'], function () {
    return gulp.src([
            'bower_components/angular-full/angular-csp.css',
            'bower_components/angular-material/angular-material.css',
            'dist/styles.css'
        ])
        .pipe(minifyCSS())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('dist'));
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
            'bower_components/angular-material/angular-material.min.js',
            'app/*.js'
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('app/*.js', ['lint', 'scripts:merge']);
    gulp.watch('app/sass/*.sass', ['styles']);
    gulp.watch('app/views/*.html', ['copy']);
});

// Uglify scripts for publishing
gulp.task('publish', ['default'], function () {
    return gulp.src('dest/scripts.js')
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist'));
});

// Default Task
gulp.task('default', function () {
    rimraf('dest', function () {
        runSequence('bower', 'lint', 'styles', 'scripts:merge', 'copy');
    })
});
