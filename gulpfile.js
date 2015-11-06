'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var resolve = require('resolve');
var _ = require('underscore');

var frontSrcDir = path.join(__dirname, '/app/front');
var frontScriptsDir = path.join(frontSrcDir, '/scripts');
var frontStylesDir = path.join(frontSrcDir, '/styles');

var publicDir = path.join(__dirname, '/app/public');
var publicScriptsDir = path.join(publicDir, '/');
var publicStylesDir = path.join(publicDir, '/');
var publicFontsDir = path.join(publicDir, '/fonts');

var nodeModulesDir = path.join(__dirname, '/node_modules');

var modules = [
  'jquery',
  'underscore',
  'bluebird'
];

var appModules = {
  'app/services': './app/services'
};

gulp.task('default', [
  'app.scripts',
  'app.modules',
  'app.styles',
  'vendor.scripts',
  'vendor.styles',
  'vendor.fonts'
]);

gulp.task('app.scripts', function() {
  var files = [
    path.join(frontScriptsDir, '/application.js'),
    path.join(frontScriptsDir, '/config/*.js'),
    path.join(frontScriptsDir, '/controllers/*.js'),
    path.join(frontScriptsDir, '/directives/*.js'),
    path.join(frontScriptsDir, '/filters/*.js'),
    path.join(frontScriptsDir, '/services/*.js')
  ];
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('app.modules', function() {
  var bundler = browserify({});

  _.forEach(modules, function (id) {
    bundler.require(resolve.sync(id), {expose: id});
  });
  _.forEach(appModules, function (path, id) {
    bundler.require(resolve.sync(path), {expose: id});
  });
  bundler.add(path.join(frontScriptsDir, '/modules.js')); // Init modules

  return bundler.bundle()
    .pipe(source('modules.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('app.styles', function() {
  var files = [
    path.join(frontStylesDir, '/main.css')
  ];
  return gulp.src(files)
    .pipe(prefixer({browsers: ['last 4 versions']}))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(publicStylesDir));
});

gulp.task('vendor.scripts', function() {
  var files = [
    path.join(nodeModulesDir, '/bootstrap/dist/js/bootstrap.min.js'),
    path.join(nodeModulesDir, '/angular/angular.min.js')
  ];
  return gulp.src(files)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('vendor.styles', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/css/font-awesome.min.css'),
    path.join(nodeModulesDir, '/bootstrap/dist/css/bootstrap.min.css')
  ];
  return gulp.src(files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(publicStylesDir));
});

gulp.task('vendor.fonts', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/fonts/*'),
    path.join(nodeModulesDir, '/bootstrap/dist/fonts/*')
  ];
  return gulp.src(files)
    .pipe(gulp.dest(publicFontsDir));
});
