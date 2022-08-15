//npm install @babel/preset-env @babel/register

import { clean } from './utils/clean.js'

const babelTask = cb => {
  console.log('run gulpfile.babel.js')
  cb()
}

export default babelTask
export { clean }
