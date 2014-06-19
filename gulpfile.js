var gulp   = require('gulp'),
  concat   = require('gulp-concat'),
  coffee   = require('gulp-coffee'),
  karma    = require('karma').server,
  uglify   = require('gulp-uglify'), 
  rename   = require('gulp-rename');

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
    'dist/*.js',
    'spec/*.coffee'
  ]
};

var sourceGlob = [
  'source/*.coffee'
];

gulp.task('watch', function (done) {
  karma.start(karmaConf, done); 
  var sourceWatcher = gulp.watch(sourceGlob, ['build']);
});

gulp.task('watch:chrome', function (done) {
  karmaConf.browsers = ["Chrome"];
  karma.start(karmaConf, done); 
  var sourceWatcher = gulp.watch(sourceGlob, ['build']);
});

gulp.task('minify', function () {
  return gulp.src("dist/svg-input-elements.js")
    .pipe(rename({extname: '.min.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', function () {
  return gulp.src(sourceGlob)
    .pipe(coffee())
    .pipe(concat('svg-input-elements.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['watch']);
