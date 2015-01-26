var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require("gulp-rename");
var notify = require("gulp-notify");
var browserSync = require('browser-sync');


var handleErrors = require('./gulp/handleErrors');


gulp.task('default', ['watch' , 'browser-sync']);

gulp.task('watch' , [ 'js'], function(){
    gulp.watch('public/*.html', browserSync.reload);
    gulp.watch('public/style/*.css',  browserSync.reload({stream:true}));
    gulp.watch('public/js/*.js', ['js',  browserSync.reload]);
	gulp.watch('public/js/*/*.js', ['js',  browserSync.reload]);


   
})
gulp.task('browser-sync', function() {
    browserSync({
        options: {
         proxy: "localhost:3454"
     }
    });
});



gulp.task('js', function () {

    gulp.src('public/js/app.js')
        .pipe(browserify({insertGlobals: true}).on('error', handleErrors))
    .pipe(rename("public/js/bundle.js"))
    .pipe(gulp.dest(''));

});
