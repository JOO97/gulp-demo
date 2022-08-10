const { task, series, parallel } = require('gulp')

//任务1
task('myTask1', cb => {
  console.log('myTask1')
  cb()
})

//任务2
task('myTask2', cb => {
  console.log('myTask2')
  cb()
})

//任务3
task('myTask3', series(task('myTask1'), task('myTask2')))

//默认任务
const defaultTask = async () => {
  console.log('default task of myGulpFile.js')
  return await parallel(task('myTask3'), task('myTask1'))
}

exports.default = defaultTask
