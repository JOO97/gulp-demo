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

exports.default = series(task('clean'), () => {
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
})
