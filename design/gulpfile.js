/**
* Require Gulp modules
*/
var gulp = require('gulp'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    // PostCSS plugins
    mixins = require('postcss-mixins'),
    simplevars = require('postcss-simple-vars'),
    nested = require('postcss-nested'),
    customMedia = require('postcss-custom-media'),
    postcssInlineSvg = require('postcss-inline-svg'),
    postcssSvgo = require('postcss-svgo'),
    colorFunction = require('postcss-color-function'),
    calc = require('postcss-calc'),
    autoprefixer = require('autoprefixer'),
    atImport = require('postcss-import'),
    cssNano = require('cssnano'),
    colorFunction = require('postcss-color-function'),
    gulpStylelint = require('gulp-stylelint');


/**
* Run Gulp connect server and livereload
*/
gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

/**
* Open index page in browser
*/
gulp.task('open', function(){
  gulp.src(__filename)
  .pipe(open({
    uri: 'http://localhost:8080'
    })
  );
});

// PostCSS build task
gulp.task('cssBuild', function (){
  var postCSSPlugins = [
    // Import CSS file to be built with it's imports
    atImport ({
      from: 'src/css/app.css'
    }),
    // Add mixin PostCSS support
    mixins,
    // Add variables PostCSS support
    simplevars,
    // Add nesting PostCSS support
    nested,
    // Add CSS color functions PostCSS support
    colorFunction,
    // Reference an SVG file and control its attributes with CSS
    postcssInlineSvg,
    // Optimise inline SVG with PostCSS
    postcssSvgo,
    // Add calc PostCSS support
    calc,
    // Add custom media queries PostCSS support
    customMedia,
    // Add W3C CSS color function to more compatible CSS PostCSS support
    colorFunction,
    // Add vendor prefixing PostCSS support
    autoprefixer ({
      browsers: ['last 2 version']
    })
  ];
  return gulp.src('src/css/app.css')
    // Prevent pipe breaking caused by errors from gulp plugins
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    // Add PostCSS plugins to pipe
    .pipe(postcss(postCSSPlugins))
    // Processed folder file destination
    .pipe(gulp.dest('dist/css'))
    // Minify the CSS
    .pipe(postcss([
        cssNano
    ]))
    // Rename
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

// Stylelint
gulp.task('cssLint', function () {
    return gulp.src('src/css/*.css')
        .pipe(gulpStylelint({
            reporters: [
            {formatter: 'string', console: true}
            ]
        }));
   }
)

// Build css
gulp.task('cssdistBuild', function() {
  return gulp.src('dist/css/*.css')
    .pipe(connect.reload());
})


// Build HTMl
gulp.task('htmlBuild', function() {
  return gulp.src('*.html')
    .pipe(connect.reload());
})

// Build JS
gulp.task('jsBuild', function() {
  return gulp.src('assets/js/*.js')
    .pipe(connect.reload());
})

/**
* Run all tasks and watchers
*/
gulp.task('styles', ['open', 'cssLint','cssBuild', 'connect', 'htmlBuild', 'jsBuild'],
    function () {
        gulp.watch('src/css/*.css', ['cssLint','cssBuild']);
        gulp.watch('dist/css/*.css', ['cssdistBuild']);
        gulp.watch('*.html', ['htmlBuild']);
        gulp.watch('assets/js/*.js', ['jsBuild']);
   }
)

