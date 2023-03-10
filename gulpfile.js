const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imageResize = require('gulp-image-resize');

// Task to minify HTML files
gulp.task('minify-html', () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

// Task to prefixes CSS files
gulp.task('add-prefixes', () => {
  return gulp.src('dist/css/*.css')
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions', 'IE 11']
    }))
    .pipe(gulp.dest('dist/css'));
});

// Task to convert SCSS files to minified CSS
gulp.task('compile-sass', gulp.series(() => {
  return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
}, 'add-prefixes'));

// Task to transpile and minify ES6 and ES7 JavaScript to ES5
gulp.task('compile-js', () => {
  return gulp.src('src/js/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'));
});

// Task to resize images
gulp.task('resize-images', async () => {
  gulp.src('src/img/*.{jpg,JPG,JPEG,jpeg,png,PNG}')
    .pipe(imageResize({
      width : 1920,
      height : 1920,
      crop : false,
      upscale : false
    }))
    .pipe(gulp.dest('dist/img'))
    .pipe(imageResize({
      width: 1024,
      height: 1024,
      crop: true,
      upscale: true
    }))
    .pipe(gulp.dest('dist/img/1024'))
    .pipe(imageResize({
      width: 300,
      height: 300,
      crop: true,
      upscale: true
    }))
    .pipe(gulp.dest('dist/img/300'));
});

// Default task to run all other tasks
gulp.task('default', gulp.series('minify-html', 'compile-sass', 'compile-js', 'add-prefixes','resize-images'));

// Task to watch for changes in files and run tasks automatically
gulp.task('watch', () => {
  gulp.watch('src/*.html', gulp.series('minify-html'));
  gulp.watch('src/scss/*.scss', gulp.series('compile-sass', 'add-prefixes'));
  gulp.watch('src/js/*.js', gulp.series('compile-js'));
  gulp.watch('src/img/*.{jpg,jpeg,png}', gulp.series('resize-images'));
});


//gulp watch