const { task, series } = require('gulp')

/**
 * 创建任务的方法
 */
//方法一
const task1 = cb => {
  cb()
}

//方法二
task('task2', cb => {
  cb()
})
exports.task2 = task('task2')

//组合任务
exports.default = series(task1, task('task2'))
