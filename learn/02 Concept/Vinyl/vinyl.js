const { dest } = require('gulp')

/**
 * Vinyl
 * 可以看做一个文件描述器，通过它可以轻松构建单个文件的元数据（metadata object）描述对象
 */
const Vinyl = require('vinyl')

const jsFile = new Vinyl({
  cwd: '/',
  base: '/test/',
  path: '/test/test.js',
  contents: Buffer.from('test Vinyl'),
})

const emptyFile = new Vinyl()
// jsFile.contents.pipe(dest(jsFile.dirname))
jsFile.contents.pipe(dest(jsFile.dirname))
console.log(jsFile.contents)
// console.dir(jsFile)
// console.dir(emptyFile)
