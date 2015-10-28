require('es6-promise').polyfill();

// Include gulp
var gulp = require('gulp');

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

gulp.task('bower:fetch', bower);

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

var sassConverted = function() {
    return gulp
        .src('app/sass/*.sass')
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions'));
};

// Concatenate, prefix and minify CSS
gulp.task('styles', function() {
    return es.merge(sassConverted(), gulp.src(['bower_components/angular/angular-csp.css']))
        .pipe(minifyCSS())
        .pipe(concat('poker.css'))
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('app/*.js')
        .pipe(concat('poker.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['styles']);
});

// Default Task
gulp.task('default', ['bower:fetch', 'lint', 'styles', 'scripts']);
