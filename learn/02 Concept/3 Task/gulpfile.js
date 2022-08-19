const { task, series } = require('gulp')

/**
 * 创建任务的方法
 */
//方法一
const task1 = cb => {
  cb()
}

//exports.[任务名称]
exports.task = task1

//方法二
const task2 = cb => {
  cb()
}
task(task2)

//方法三
task('task3', cb => {
  cb()
})

//组合任务
exports.default = series(task1, task('task3'))
