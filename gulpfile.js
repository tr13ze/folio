
'use strict';
var path         = require('path');
var browserify   = require('browserify');
var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var jshint       = require('gulp-jshint');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssmin       = require('gulp-cssmin');
var rename       = require("gulp-rename");
var livereload   = require('gulp-livereload');
var connect      = require('gulp-connect');
var opn          = require('opn');

gulp.task('jsLint', function () {
    gulp.src(['./src/js/*.js'])
    .pipe(jshint())
    .pipe(livereload())
});

gulp.task('js', function() {
  return browserify({
entries: ['./src/js/app.js'],
extensions: ['.js'],
paths: ['./node_modules','./src/js/']
    })
    .bundle({debug: true})
    .on('error', console.error.bind(console))
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify({ mangle: false}))
    .pipe(gulp.dest('./www/js'))
    .pipe(livereload())
});

gulp.task('sass', function(){
  return gulp.src('./src/scss/app.scss')
    .pipe(sass())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./www/css'))
    .pipe(livereload())
});

gulp.task('connect', function() {
  connect.server({
    root: 'www',
    port: 8888,
    livereload: true
  });
  //opn('http://localhost:8888/');
});

gulp.task('prod',['sass', 'js']);

gulp.task('testjs',['jsLint', 'js']);

gulp.task('watch', function(){
  //opn('http://localhost:8888/');
  livereload.listen();
  gulp.watch('./src/scss/*.scss', ['sass'])
  gulp.watch('./src/js/*.js', ['js'])
});

gulp.task('default', ['connect', 'watch']);
