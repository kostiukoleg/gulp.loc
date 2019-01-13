var gulp = require('gulp'),
sourcemaps = require('gulp-sourcemaps'),
concat = require('gulp-concat'),
htmlmin = require('gulp-cleanhtml'),
cleanCSS = require('gulp-clean-css'),
uglify = require('gulp-uglify'),
rename = require('gulp-rename'),
notify = require('gulp-notify'),
prefix = require('gulp-autoprefixer'),
del = require('del'),
image = require('gulp-image'),
browsersync = require('browser-sync').create(),
removeHtmlComments = require('gulp-remove-html-comments');

function clean(cb) {

    del(['app/bundle/css/*.css', 'app/bundle/js/*.js', 'app/bundle/img/*', 'app/bundle/html/*']);
    
    cb();

}

function browserSync(cb) {

    browsersync.init({
        server: {
        baseDir: "./app/bundle/html/"
        },
        port: 3000
    });

cb();

}

function browserSyncReload(cb) {

    browsersync.reload();

    cb();

}

function watchFiles(cb) {

    gulp.watch('app/js/*.js', javascript);  
    gulp.watch('app/css/*.css', css);
    gulp.watch('app/images/*', images);
    gulp.watch('app/*.html', html);

    cb();
}

function images(cb) {

gulp.src("app/images/*")
    .pipe(image({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        guetzli: false,
        gifsicle: true,
        svgo: true,
        concurrent: 10,
        quiet: true // defaults to false
    }))
    .pipe(gulp.dest("app/bundle/img"));

cb();

}

function javascript(cb) {

    gulp.src('app/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write())
    .pipe(uglify())
    .pipe(rename("all.min.js"))
    .pipe(gulp.dest('app/bundle/js'))
    .pipe(browsersync.stream());

    cb();

}
  
function css(cb) {

    gulp.src('app/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('all.css'))
    .pipe(sourcemaps.write())
    .pipe(prefix('last 2 versions', '> 1%', 'ie 9'))
    .pipe(cleanCSS())
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest('app/bundle/css'))
    .pipe(browsersync.stream());

    cb();

}

function html(cb) {

gulp.src('app/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('app/bundle/html'))
    .pipe(browsersync.stream());

    cb();

}
  
exports.watch = gulp.parallel(watchFiles, browserSync);
exports.default = gulp.parallel(clean, javascript, css, images, html);