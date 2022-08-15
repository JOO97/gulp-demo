const { series, parallel, task } = require('gulp')

function javascript(cb) {
  console.log('javascript')
  setTimeout(cb, 1000)
}

function css(cb) {
  console.log('css')
  cb()
}

// task('image', cb => cb())

exports.default = series(javascript, css)

// exports.default = parallel(javascript, css)
