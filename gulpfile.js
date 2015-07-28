// load the plugins
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var del = require('del');
var ngAnnotate = require('gulp-ng-annotate');



gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['public/assets/css/styles.min.css', 'public/app/all.min.js'], function (err, paths) {
        console.log('Deleted files/folders:\n', paths.join('\n'));
    });
});

gulp.task('css', function() {
// grab the less file, process the LESS, save to style.css
    return gulp.src('public/assets/less/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(concat('styles.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/assets/css'));
});

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(ngAnnotate())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/app'));
});

gulp.task('all', ['css', 'scripts']);