var gulp = require('gulp');
var semistandard = require('gulp-semistandard');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('style', () => {
  return gulp.src(jsFiles)
    .pipe(semistandard())
    .pipe(semistandard.reporter('default', {
      breakOnError: true,
      quiet: true
    }));
});

gulp.task('inject', () => {
  var options = {
    bowerJson: require('./bower.json'),
    directory: './public/lib',
    ignorePath: '../public'
  };
  var injectSrc = gulp.src(['./public/stylesheets/*.css', './public/javascripts/*.js'], {read: false});
  var injectOptions = {
    ignorePath: '/public'
  };

  return gulp.src('./views/*.ejs')
    .pipe(wiredep(options))
    .pipe(inject(injectSrc, injectOptions))
    .pipe(gulp.dest('./views'));
});

gulp.task('serve', ['style', 'inject'], () => {
  var options = {
    script: './bin/www',
    delayTime: 1,
    env: {
      'PORT': 5000
    },
    watch: jsFiles
  };

  return nodemon(options)
    .on('restart', (ev) => {
      console.log('Restarting....');
    });
});

gulp.task('default', ['serve']);
