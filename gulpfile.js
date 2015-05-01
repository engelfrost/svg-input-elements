var gulp = require('gulp');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var karma  = require('karma').server;
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

var karmaConf = {
  browsers: ['PhantomJS'],
  //browsers: ['Chrome'],
  preprocessors: {
    '**/*.coffee': ['coffee'],
  },
  frameworks: ['jasmine'],
  coffeePreprocessor: {
    // options passed to the coffee compiler
    options: {
      bare: true,
      sourceMap: true
    },
    // transforming the filenames
    transformPath: function(path) {
      return path.replace(/\.coffee$/, '.js');
    }
  },
  files: [
    'gh/*.js',
    'spec/*.coffee'
  ]
};

var sourceGlob = [
  'source/*.coffee'
];

gulp.task('browser-sync', function() {
  browserSync.init(null, {
    server: {
      baseDir: './'
    }
  });
});

gulp.task('watch', ['browser-sync'], function(done) {
  karma.start(karmaConf, done);
  gulp.watch(sourceGlob, ['gh']);
});

gulp.task('gh', function() {
  return gulp.src(sourceGlob)
    .pipe(coffee())
    .pipe(concat('svg-input-elements.js'))
    .pipe(gulp.dest('gh/'));
});

gulp.task('default', ['watch']);
