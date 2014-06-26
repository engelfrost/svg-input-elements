var gulp  = require('gulp'),
  concat  = require('gulp-concat'),
  coffee  = require('gulp-coffee'),
  karma   = require('karma').server,
  uglify  = require('gulp-uglify'), 
  rename  = require('gulp-rename'), 
  connect = require('gulp-connect');

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

var examplesGlob = [
	'dist/svg-input-elements.js', 
	'examples/*.html'
];

gulp.task('connect', function () {
	connect.server({
		root: './', 
		livereload: true
	})
});

gulp.task('examples', function () {
	gulp.src(examplesGlob)
		.pipe(connect.reload());
});

gulp.task('watch', ['connect'], function (done) {
  karma.start(karmaConf, done); 
  gulp.watch(sourceGlob, ['build']);
  gulp.watch(examplesGlob, ['examples']);
});

gulp.task('watch:chrome', function (done) {
  karmaConf.browsers = ["Chrome"];
  karma.start(karmaConf, done); 
  gulp.watch(sourceGlob, ['build']);
});

gulp.task('build:minify', ['build'], function () {
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
