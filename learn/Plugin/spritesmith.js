const gulp = require('gulp')
const spritesmith = require('gulp.spritesmith')
const buffer = require('vinyl-buffer')
const csso = require('gulp-csso')
const merge = require('merge-stream')
const inject = require('gulp-inject')

const sprite = () => {
  // Generate our spritesheet
  var spriteData = gulp.src('src/images/*.png').pipe(
    spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
    })
  )

  // Pipe image stream through image optimizer and onto disk
  var imgStream = spriteData.img
    .pipe(buffer())
    .pipe(gulp.dest('output/sprite/'))

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css.pipe(csso()).pipe(gulp.dest('output/sprite/'))

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream)
}

exports.default = gulp.series(sprite, () => {
  return gulp
    .src('./src/html/*.html')
    .pipe(
      inject(gulp.src('./output/sprite/*.css'), {
        relative: false,
        ignorePath: 'output',
        addPrefix: '.',
        addRootSlash: false,
      })
    )
    .pipe(gulp.dest('output/'))
})
