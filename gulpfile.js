const { series, src, dest, task } = require('gulp')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const sourceMap = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const webpack = require('webpack-stream')

//clean task
task('clean', () => {
  return src('build/*', { allowEmpty: true, read: false }).pipe(clean())
})
// exports.build = task('clean')

const task1 = cb => {
  console.log('task1')
  cb()
}

exports.task1 = task1

exports.default = series(
  task('clean'),
  () => {
    return (
      src('src/**/*.js')
        .pipe(sourceMap.init())
        .pipe(
          babel({
            presets: ['@babel/preset-env'],
          })
        )
        .pipe(
          webpack({
            output: {
              filename: 'build.js',
            },
          })
        )
        // .pipe(uglify())
        .pipe(
          rename(path => {
            // console.log(path)
            // path.dirname += '/ciao'
            // path.basename += '-xxx'
          })
        )
        .pipe(dest('build'))
    )
  },
  cb => {
    cb()
  }
)

//任务返回值
const { exec } = require('child_process')
function childProcessTask() {
  return exec('date')
}
exports.default2 = childProcessTask

const { EventEmitter } = require('events')
function eventEmitterTask() {
  const emitter = new EventEmitter()
  // Emit has to happen async otherwise gulp isn't listening yet
  setTimeout(() => emitter.emit('finish'), 250)
  return emitter
}
exports.default3 = eventEmitterTask

const { Observable } = require('rxjs')
function observableTask() {
  return Observable.of(1, 2, 3)
}
exports.default4 = observableTask

function callbackError(cb) {
  // `cb()` should be called by some async work
  cb(new Error('kaboom'))
}
exports.default5 = callbackError

//task cb test
function callbackError2(cb) {
  try {
    const obj = {
      fn: () => {},
      a,
    }
    JSON.stringify(obj)
    exec('date')
    cb()
  } catch (error) {
    cb('error')
  }
}
exports.default6 = callbackError2
