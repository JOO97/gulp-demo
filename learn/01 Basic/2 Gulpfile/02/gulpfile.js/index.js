// 分割gulpfile
const { clean } = require('./clean')

const jsTask = cb => {
  console.log('run gulpfile.js/index.js ')
  cb()
}
exports.default = jsTask
exports.clean = clean
