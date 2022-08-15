import tool from './utils/index'

const tsTask = (cb): void => {
  console.log('run gulpfile.ts')
  tool()
  cb()
}
exports.default = tsTask
