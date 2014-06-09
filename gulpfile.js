var gulp   = require('gulp'),
	concat   = require('gulp-concat'),
	karma    = require('karma').server,
	coffee   = require('gulp-coffee');

var karmaConf = {
	browsers: ['Chrome'],
	frameworks: ['jasmine', 'fixture'],
	preprocessors: {
		'**/*.coffee': ['coffee'], 
		'**/*.json': ['html2js'],
		'**/*.html': ['html2js']
	},
	coffeePreprocessor: {
		// options passed to the coffee compiler
		options: {
			bare: true,
			sourceMap: false
		},
		// transforming the filenames
		transformPath: function(path) {
			return path.replace(/\.coffee$/, '.js');
		}
	},
	files: [
		'dist/*.js',
		'spec/*.coffee', 
		{
			pattern: 'spec/fixtures/**/*'
		}
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