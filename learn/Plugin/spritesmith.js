var gulp = require('gulp')
var spritesmith = require('gulp.spritesmith')
var buffer = require('vinyl-buffer')
var csso = require('gulp-csso')
var merge = require('merge-stream')

gulp.task('sprite', function () {
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
    .pipe(gulp.dest('output/sprite/image/folder/'))

  // Pipe CSS stream through CSS optimizer and onto disk
  var cssStream = spriteData.css
    .pipe(csso())
    .pipe(gulp.dest('output/sprite/css/folder/'))

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream)
})
