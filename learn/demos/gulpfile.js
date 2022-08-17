const { src, dest, watch, series, parallel } = require('gulp')

const htmlMin = require('gulp-htmlmin')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const less = require('gulp-less') // less
const postcss = require('gulp-postcss') // postcss
const postcssPresetEnv = require('postcss-preset-env')
const inject = require('gulp-inject')

const sourceMap = require('gulp-sourcemaps')

const browserSync = require('browser-sync')
const webpack = require('webpack-stream')

const del = require('del')

const htmlTask = () => {
  return src('./src/*.html', { base: './src' })
    .pipe(
      htmlMin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest('./dist'))
}

const jsTask = () => {
  return src('./src/js/**.js', { base: './src' })
    .pipe(sourceMap.init())
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(
      webpack({
        output: {
          filename: './js/[name].js',
        },
      })
    )
    .pipe(terser({ mangle: { toplevel: true } }))
    .pipe(sourceMap.write('./'))
    .pipe(dest('./dist'))
}

const lessTask = () => {
  return src('./src/css/*.less', { base: './src' })
    .pipe(less())
    .pipe(postcss([postcssPresetEnv()]))
    .pipe(dest('./dist'))
}

const injectHtml = () => {
  return src('./dist/*.html')
    .pipe(
      inject(src(['./dist/js/*.js', './dist/css/*.css']), { relative: true })
    )
    .pipe(dest('./dist'))
}

// 搭建本地服务器
const bs = browserSync.create()
const serve = () => {
  watch('./src/*.html', series(htmlTask, injectHtml))
  watch('./src/js/*.js', series(jsTask, injectHtml))
  watch('./src/css/*.less', series(lessTask, injectHtml))

  bs.init({
    port: 8085,
    open: true,
    files: './dist/*',
    server: {
      baseDir: './dist',
    },
  })
}

const clean = () => {
  return del(['dist'])
}

//构建任务
const buildTask = series(
  clean, //清理目录
  parallel(htmlTask, jsTask, lessTask), //分别处理html、js、less文件
  injectHtml //将处理后的文件地址注入到html
)
//本地服务
const serveTask = series(buildTask, serve)

module.exports = {
  serveTask,
  buildTask,
}
