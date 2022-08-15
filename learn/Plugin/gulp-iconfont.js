const gulp = require('gulp')

var iconfont = require('gulp-iconfont')
var runTimestamp = Math.round(Date.now() / 1000)

gulp.task('iconfont', function () {
  return gulp
    .src(['src/icons/*.svg'])
    .pipe(
      iconfont({
        fontName: 'myfont', // required
        prependUnicode: true, // recommended option
        formats: ['ttf', 'eot', 'woff'],
        timestamp: runTimestamp, // recommended to get consistent builds when watching files
      })
    )
    .on('glyphs', function (glyphs, options) {
      console.log(glyphs, options)
      gulp
        .src('templates/myfont.css')
        .pipe(
          consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'myfont',
            fontPath: '../fonts/',
            className: 's',
          })
        )
        .pipe(gulp.dest('www/css/'))
        .on('finish', cb)
    })
    .pipe(gulp.dest('output/fonts/'))
})
