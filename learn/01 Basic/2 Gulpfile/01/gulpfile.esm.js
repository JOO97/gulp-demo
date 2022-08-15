import { clean } from './utils/clean'

const esmTask = cb => {
  console.log('run gulpfile.esm.js')
  cb()
}

export default esmTask
export { clean }
