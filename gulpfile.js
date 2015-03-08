var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  runSequence = require('run-sequence');

var runningTasks = {};
var paths = {
  code: 'lib/**/**.js',
  tests: 'test/**/*.js',
  unit: 'test/unit/**/*.js',
  integration: 'test/integration/**/*.js',
  gulpfile: 'gulpfile.js'
};

gulp.task('jshint', function () {
  runningTasks.jshint = true;

  return gulp.src([paths.gulpfile, paths.code, paths.tests])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('unit', function () {
  runningTasks.unit = true;

  return gulp.src(paths.unit)
    .pipe(mocha({reporter:'spec'}));
});

gulp.task('integration', function () {
  runningTasks.integration = true;

  return gulp.src(paths.integration)
    .pipe(mocha({reporter:'spec'}));
});

gulp.task('test', function (cb) {
  runningTasks.unit = true;
  runningTasks.integration = true;

  runSequence('unit', 'integration', function () { cb(); });
});

gulp.task('watch', function () {
  if(runningTasks.jshint) {
    gulp.watch([paths.gulpfile, paths.code, paths.tests], ['jshint']);
  }

  if(runningTasks.unit) { gulp.watch([paths.unit], ['unit']); }
  if(runningTasks.integration) { gulp.watch([paths.integration], ['integration']); }

  var testAction;
  if(runningTasks.unit && runningTasks.integration) { testAction = 'test'; }
  else if(runningTasks.unit) { testAction = 'unit'; }
  else if(runningTasks.integration) { testAction = 'integration'; }
  if(testAction) {
    gulp.watch([paths.code], [testAction]);
  }
});

gulp.task('default', ['jshint', 'test', 'watch']);