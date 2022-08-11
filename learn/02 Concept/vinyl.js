const fs = require('fs')
const { dest, task, src, symlink } = require('gulp')
const debug = require('gulp-debug')

const Vinyl = require('vinyl')
const vinylFs = require('vinyl-fs')
/**
 * 1 Vinyl
 */
const jsFile = new Vinyl({
  cwd: '/',
  base: '/test/',
  path: '/test/test.js',
  contents: Buffer.from('test Vinyl'),
})
Object.keys(jsFile).forEach(key => {
  console.log(key, jsFile[key])
})

const emptyFile = new Vinyl()
console.dir(emptyFile)

/**
 * 2 Vinyl-fs
 */
task('vinyl-fs', () => {
  return vinylFs.src('/').pipe(vinylFs.dest('./dist'))
})

task('default', () => {
  return src('vinyl-fs.js')
    .pipe(debug({ title: 'unicorn:' }))
    .pipe(dest('dist'))
})
