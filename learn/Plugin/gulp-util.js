const gulp = require('gulp')
const gutil = require('gulp-util')

//log
gutil.log('stuff happened', 'Really it did')

//colors
gutil.log(gutil.colors.green('green'), gutil.colors.yellow('yellow'))

var newPath = gutil.replaceExtension('/src/js/utils.js', '.ts') // /src/js/utils.ts

exports.default = cb => {
  gutil.log('isBuffer', gutil.isBuffer(gulp.src('./src/js/utils.js'))) //isBuffer

  gutil.log('isStream', gutil.isStream(gulp.src('./src/js/utils.js'))) //isStream
  cb()
}
