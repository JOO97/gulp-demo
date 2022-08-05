function defaultTask(cb) {
  // place code for your default task here
  console.log('test gulp', cb)
  cb()
}

exports.default = defaultTask
