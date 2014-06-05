var gulp   = require('gulp'),
	cached   = require('gulp-cached'),
	remember = require('gulp-remember'),
	concat   = require('gulp-concat'),
	karma    = require('karma').server;

var karmaConf = {
  browsers: ['Chrome'],
	frameworks: ['jasmine'],
  files: [
    'examples/libs/jquery-1.7.2.js',
    'examples/libs/jquery.transit.min.js',
    'examples/libs/jquery.svg.js',
    'dist/*.js',
    'tests/*.js'
  ]
};

var sourceGlob = [
	"source/000.header.js",
	"source/100.helpers.js", 
	"source/200.SVGInputElements.js", 
	"source/300.SVGSelectableGElement.js", 
	"source/400.SVGEditableTextBox.js", 
	"source/401.SVGEditableTextBox.js", 
	"source/450.SVGEditableList.js", 
	"source/460.SVGEditableText.js", 
	"source/500.SVGTextMarker.js", 
	"source/600.SVGEditableImage.js",
	"source/999.footer.js"
];

gulp.task('watch', function (done) {
	karma.start(karmaConf, done); 
	var sourceWatcher = gulp.watch(sourceGlob, ['build']);

	// remove deleted scripts
	sourceWatcher.on('change', function (event) {
		if (event.type === 'deleted') {
			delete cache.caches['scripts'][event.path]; 
			remember.forget('scripts', event.path);
		}
	});
});

gulp.task('build', function () {
	return gulp.src(sourceGlob)
		.pipe(cached('scripts'))
		.pipe(remember('scripts'))
		.pipe(concat('svg-input-elements.js'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('default', ['watch']);

// gulp.task('test', function () {
// 	return gulp.source(karmaConf)
// 		.pipe(karma({
// 			configFile: 'karma.conf.js', 
// 			action: 'run'
// 		}))
// 		.on('error', function (error) {
//       // Make sure failed tests cause gulp to exit non-zero
//       throw error;
//     });
// });

// gulp.task('build:debug', function () {
// 	return gulp.source(sourceGlob)
// 		.pipe(concat('svg-input-elements.js'))
// 		.pipe(gulp.dest('dist/'));
// });

// gulp.task('scripts', function () {
// 	return gulp.source(sourceGlob)
// 		.pipe(cached('scripts'))
// 		.pipe(remember('scripts'))
// 		.pipe(concat('svg-input-elements.js'))
// 		.pipe(gulp.dest('dist/'));
// });

// gulp.task('watch', function () {
// 	var watcher = gulp.watch(sourceGlob, ['scripts']);
// 	watcher.on('change', function (event) {
// 		if (event.type === 'deleted') {
// 			delete cache.caches['scripts'][event.path]; 
// 			remember.forget('scripts', event.path);
// 		}
// 	});
// });