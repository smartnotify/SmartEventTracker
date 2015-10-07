var gulp = require('gulp');
var typeScript = require('gulp-typescript');
var mocha  = require('gulp-mocha');

gulp.task('typescript', function() {
    return gulp.src('scripts/typescript/*.ts')
        .pipe(typeScript({
            module: 'commonjs'
        }))
        .pipe(gulp.dest('scripts'));
});

gulp.task('unitTest', function() {
    return gulp.src('scripts/tests/unit/*.js')
        .pipe(mocha({
            reporter: 'dot'
        }))
});

gulp.task('default', function() {
    gulp.watch('scripts/typescript/*.ts', ['typescript']);
    gulp.watch('scripts/tests/unit/*.js', ['unitTest']);
});
