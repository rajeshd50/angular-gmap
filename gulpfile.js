'use strict';
var require;
var gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    concat = require('gulp-concat'),

    browserify = require('gulp-browserify'),
    stringify = require('stringify'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    minify = require('gulp-minify'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    ngConstant = require('gulp-ng-constant'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),

    options = {
        env: process.env.NODE_ENV || 'production',
        outputClientDir: process.env.OUTPUT_DIR || 'dist/',
        sass: process.env.sass || 'sass/app.scss',
        js: process.env.js || 'scripts/app.js',
        libCss: [
        ],
        libJs: [
            'bower_components/angular/angular.min.js',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-aria/angular-aria.min.js',
            'bower_components/angular-messages/angular-messages.min.js',
            'bower_components/angular-sanitize/angular-sanitize.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js'
        ],
        indexSrc: 'scripts/index.html'
    };
var onError = function(err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);

    this.emit('end');
};


gulp.task('vendorCss', function() {
    return gulp.src(options.libCss)
        .pipe(cssmin())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(options.outputClientDir + '/css'));
});

gulp.task('sass', function() {
    var config = {};
    return gulp.src(options.sass)
        .pipe(sass(config))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(options.outputClientDir + '/css'));
});
gulp.task('js', function() {
    return gulp.src(options.js, {
        read: false
    })
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(ngAnnotate())
    .pipe(browserify({
        transform: stringify({
            extensions: ['.html', '.tpl'],
            minify: true
        })
    }))
    .pipe(minify({
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulpIf(options.env !== 'development', uglify()))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest(options.outputClientDir + '/js'))
    .pipe(notify({
        title: 'Gulp',
        subtitle: 'success',
        message: 'Js task finished',
        sound: "Pop"
    }));
});

gulp.task('vendor', function() {
    return gulp.src(options.libJs)
        // .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(options.outputClientDir + '/js'));
});

gulp.task('copyIndex', function() {
    return gulp.src(options.indexSrc)
    .pipe(gulp.dest(options.outputClientDir));
});

gulp.task('server', function() {
  browserSync({
    server: {
     baseDir: './build' 
    }
  });
});

gulp.task('serve',['build','server'], function() {
  return gulp.watch([
    './sass/**/*.scss','./scripts/**/*.js','./scripts/**/*.html'
  ], [
   'build', browserSync.reload
  ]);
});

gulp.task('watch', function() {
    gulp.watch('scripts/modules/**/*.js', ['js']);
    gulp.watch('scripts/modules/**/*.html', ['js']);
    gulp.watch('scripts/app.js', ['js']);
    gulp.watch(options.libJs, ['vendor']);
    gulp.watch('views/**/*.html', ['js']);
    gulp.watch(['sass/**/*.scss'], ['sass']);
    gulp.watch(options.libCss, ['vendorCss']);
    gulp.watch(options.indexSrc, ['copyIndex']);
});


gulp.task('build', ['js', 'vendor', 'vendorCss','sass','copyIndex']);

gulp.task('default', ['build', 'watch']);
