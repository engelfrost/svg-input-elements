var gulp   = require('gulp'),
	concat   = require('gulp-concat'),
	coffee   = require('gulp-coffee'),
	karma    = require('karma').server;

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

gulp.task('build', function () {
	return gulp.src(sourceGlob)
		.pipe(coffee())
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
//			 // Make sure failed tests cause gulp to exit non-zero
//			 throw error;
//		 });
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