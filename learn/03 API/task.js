const { task, series } = require('gulp')
const argv = require('yargs').argv //yargs 处理命令行参数

//clean
const clean = function (cb) {
  console.log('run clean task')
  cb()
}
clean.displayName = 'clean:all' //定义任务名称

task(clean)

//build
function build(cb) {
  console.log('run build task')
  console.log('argv', argv)
  if (argv.prod) console.log('run build task in prod mode')
  cb()
}
build.description = 'Build the project' //任务描述信息
build.flags = { '--prod': 'Builds in production mode (minification, etc).' }

task(build)

//compose
exports.compose = cb => {
  console.log('run compose task')
  cb()
}

//查询任务
console.log(task('clean:all'))
console.log(task('build').unwrap())
console.log(task('compose')) //undefined 只能查询通过task()注册的任务
