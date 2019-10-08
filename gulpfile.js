var gulp = require('gulp');
const $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var mainBowerFiles = require('main-bower-files');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');
var gulpSequence = require('gulp-sequence');


var envOptions = {
  string: 'env',
  default: { env: 'develop' }
}
var options = minimist(process.argv.slice(2), envOptions);
console.log(options);

gulp.task('clean', function () {
  return gulp.src(['./.tmp', './public'], {read: false, allowEmpty: true })
      .pipe($.clean());
});

gulp.task('jade', function() {
  /* var YOUR_LOCALS = {}; */
  return gulp.src('./source/**/*.jade')
    .pipe($.plumber())
    // .pipe($.data(function(){
    //   var menu = require('./source/data/menu.json');
    //   var khData = require('./source/data/data.json');
    //   var source = {
    //     'menu': menu,
    //     'khData': khData
    //   };
    //   // console.log('jade', source);
    //   return source;
    //   }
    // ))
    .pipe($.jade({
      /* locals: YOUR_LOCALS */
      //pretty: true
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream())
});

gulp.task('sass', function () {
  return gulp.src('./source/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested',
      includePaths: ['./node_modules/bootstrap/scss']
    }).on('error', $.sass.logError))
    //編譯完成
    .pipe($.postcss([autoprefixer()]))
    .pipe($.sourcemaps.write('.'))
    .pipe($.if(options.env == 'production', $.cleanCss()))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream())
});
gulp.task('babel', () =>
  gulp.src('./source/js/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/env']
    }))
    .pipe($.order([
      'jquery.rwdImageMaps.min.js',
      'all.js'
    ]))
    .pipe($.concat('all.js'))
    .pipe($.if(options.env == 'production', $.uglify({
      compress: {
        drop_console: true
      }
    })))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream())
);

gulp.task('imagemin', function(){
  return gulp.src('./source/images/**/*')
  .pipe($.if(options.env == 'production', $.imagemin()))
  .pipe(gulp.dest('./public/images'))
})

gulp.task('bower', function() {
  return gulp.src(mainBowerFiles({
    "overrides": {
      "vue": {                // 套件名稱
        "main": "dist/vue.js" // 取用的資料夾路徑
      }
    }
  }))
    .pipe(gulp.dest('./.tmp/vendors'));
    cb(err);
});
gulp.task('vendorJs', function() {
  return gulp.src('./.tmp/vendors/**/*.js')
  .pipe($.order([
    'jquery.js',
    'bootstrap.js'
  ]))
  .pipe($.concat('vendors.js'))
  .pipe($.if(options.env == 'production', $.uglify()))
  .pipe(gulp.dest('./public/js'))
})

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./public",
      reloadDebounce: 2000
    }
  });
});

gulp.task('watch', function () {
  gulp.watch('./source/scss/**/*.scss', ['sass']);
  gulp.watch('./source/**/*.jade', ['jade']);
  gulp.watch('./source/js/**/*.js', ['babel']);
});

gulp.task('deploy', function() {
  return gulp.src('./public/**/*')
    .pipe($.ghPages());
});

// gulp.task('build', gulpSequence('clean', 'jade', 'sass', 'babel', 'vendorJs'));

// gulp.task('default', ['jade', 'sass', 'babel', 'browser-sync', 'vendorJs', 'watch']);

gulp.task('build',
  gulp.series(
    'clean',
    'bower',
    'vendorJs',
    gulp.parallel('jade', 'sass', 'babel', 'imagemin')
  )
)

gulp.task('default',
  gulp.series(
    'clean',
    'bower',
    'vendorJs',
    gulp.parallel('jade', 'sass', 'babel', 'imagemin'),
    function(done){
      browserSync.init({
        server: {
          baseDir: "./public",
          reloadDebounce: 2000
        }
      });
      gulp.watch('./source/scss/**/*.scss', gulp.series('sass'));
      gulp.watch('./source/**/*.jade', gulp.series('jade'));
      gulp.watch('./source/js/**/*.js', gulp.series('babel'));
      done();
    }
  )
)