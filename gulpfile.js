var gulp = require('gulp');
var typeScript = require('gulp-typescript');

gulp.task('typescript', function() {
    return gulp.src('scripts/typescript/*.ts')
        .pipe(typeScript({
            noEmitOnError: false
        }))
        .pipe(gulp.dest('scripts'));
});

gulp.task('default', function() {
    gulp.watch('scripts/typescript/*.ts', ['typescript']);
});
