const { src, dest, task, symlink } = require('gulp')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')

const fs = require('fs')

/**
 * 1 src
 */
task('copy', () => {
  //1.1
  // return src('src/js/*.js', { allowEmpty: true }).pipe(dest('build/'))
  //1.2
  // return src(['src/js/*.js', 'src/css/*.css']).pipe(dest('build/'))
  //1.3 allowEmpty
  // return src('src/empty1.js', { allowEmpty: true }).pipe(dest('build/'))
})

task('clean', () => {
  //1.4 read
  return src('build/', { allowEmpty: true, read: false }).pipe(clean())
})

/**
 * 2 dest
 */
task('copy2', () => {
  //2.1 入参为字符串
  //   return src('src/js/*.js', { allowEmpty: true }).pipe(dest('build/'))
  //2.2 入参为函数
  return src(['src/js/*.js', 'src/css/*.css']).pipe(
    dest(file => {
      const ext = file.extname.replace('.', '')
      return `build/${ext}/`
    })
  )
})

//2.3 生成sourcemap
task('copy4', () => {
  return src('src/**/*.js', { sourcemaps: true })
    .pipe(uglify())
    .pipe(dest('build/', { sourcemaps: true })) //生成内联sourcemaps
  // .pipe(dest('build/', { sourcemaps: '.' })) //生成外部sourcemaps
})

/**
 * symlink
 */
task('link', () => {
  // console.log(src('scr/**/*.js').pipe(symlink('output/')))
  return src('scr/js/*.js', { allowEmpty: true })
    .pipe(symlink('dist/'))
    .on('end', () => {
      console.log(fs.statSync('src/js/bar.js'))
    })
})
