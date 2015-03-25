var gulp = require('gulp');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-htmlclean');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var concat = require('gulp-concat');
var jeet = require('jeet');
var axis = require('axis');
var rupture = require('rupture');

var path = {
    styl: './styles/*.styl',
    css: './styles/styles.css',
    js: './scripts/scripts.js',
    html: './*dev.html',
    php: './*dev.php',
    image: './images/*'
};

gulp.task('stylus', function() {
    gulp.src(path.styl)
        .pipe( stylus({ use: [jeet(), axis(), rupture()] }) )
        .pipe( gulp.dest('styles') );
});

gulp.task('minify-js', function() {
    gulp.src(['scripts/*.js', '!./scripts/public.min.js'])
        .pipe( concat('public.min.js') )
        .pipe( uglify() )
        .pipe( gulp.dest('scripts') );
});

gulp.task('minify-css', function() {
    gulp.src(['styles/*.css', '!./styles/public.min.css'])
        .pipe( concat('public.min.css') )
        .pipe( minifycss() )
        .pipe( gulp.dest('styles') );
});

gulp.task('minify-html-php', function() {
    gulp.src([path.html, path.php])
        .pipe( rename(function(path) {
            path.basename = path.basename.replace('-dev', '');
        }) )
        .pipe( minifyhtml() )
        .pipe( gulp.dest('./') );
});

gulp.task('minify-image', function() {
    gulp.src([path.image, '!./images/public'])
        .pipe( imagemin({
                          progressive: true,
                          svgoPlugins: [{
                              removeViewBox: false
                          }],
                          use: [pngquant()]
        }))
        .pipe( gulp.dest('./images/public') );
});

gulp.task('connect', function() {
    connect.server({
        root: '',
        livereload: true
    });
});

gulp.task('html', function() {
    gulp.src('*.html')
        .pipe( connect.reload() );
});

gulp.task('php', function() {
    gulp.src('*.php')
        .pipe( connect.reload() );
});

gulp.task('js', function() {
    gulp.src('scripts/public.min.js')
        .pipe( connect.reload() );
});

gulp.task('css', function() {
    gulp.src(path.css)
        .pipe( connect.reload() );
});

gulp.task('watch', function() {
    gulp.watch(path.styl, ['stylus']);
    gulp.watch(path.js, ['minify-js']);
    gulp.watch(path.css, ['minify-css']);
    gulp.watch([path.html, path.php], ['minify-html-php', 'minify-image']);
    gulp.watch(path.html, ['html']);
    gulp.watch(path.php, ['php']);
    gulp.watch(path.js, ['js']);
    gulp.watch(path.css, ['css']);
});

gulp.task('default', [
                      'stylus',
                      'minify-js',
                      'minify-css',
                      'minify-html-php',
                      'minify-image',
                      'watch',
                      'connect'
]);
