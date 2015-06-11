// load the plugins
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
// define a task called css
gulp.task('css', function() {
// grab the less file, process the LESS, save to style.css
    return gulp.src('public/assets/less/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(concat('styles.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/assets/css'));
});