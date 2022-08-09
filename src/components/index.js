import ToolBar from './ToolBar'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'

/* 对象方法 */
export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(ImageUpload.name, ImageUpload)
  }
}

/* 函数方法 */
// export default function(Vue) {
//   Vue.component(ToolBar.name, ToolBar)
// }
