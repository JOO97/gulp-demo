const { watch } = require('gulp')

exports.default = () => {
  return watch(['src/**/*'], function (cb) {
    console.log(`run watch task`)
    cb()
  })
}

//Chokidar 实例
const watcher = watch(['src/**/*'])

watcher.on('change', function (path, stats) {
  console.log(`File ${path} was changed`)
  watcher.close()
})

watcher.on('add', function (path, stats) {
  console.log(`File ${path} was added`)
})

watcher.on('unlink', function (path, stats) {
  console.log(`File ${path} was removed`)
})
