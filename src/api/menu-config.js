// 当前构造本地数据，后续从接口获取
import { productTypes } from './configs.js'
const childrenArray = []

productTypes.forEach((product) => {
  childrenArray.push({
    path: product,
    component: () => import('@/views/fileManager/fileList/product'),
    name: product,
    meta: { title: product },
    children: [
      {
        path: 'iso',
        component: () => import('@/views/fileManager/fileList/file'),
        name: product + '/iso',
        meta: { title: 'iso文件' }
      },
      {
        path: 'installer',
        component: () => import('@/views/fileManager/fileList/file'),
        name: product + '/installer',
        meta: { title: '安装包' }
      },
      {
        path: 'doc',
        component: () => import('@/views/fileManager/fileList/file'),
        name: product + '/doc',
        meta: { title: '文档' }
      },
      {
        path: 'others',
        component: () => import('@/views/fileManager/fileList/file'),
        name: product + '/others',
        meta: { title: '其他' }
      }
    ]
  })
})
export default childrenArray

