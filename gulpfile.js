var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('bundle', function() {
  gulp.src('./src/ProductCompare.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./dist/js/'));
});