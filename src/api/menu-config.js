// 当前构造本地数据，后续从接口获取
import productTypes from './product'
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
module.exports = childrenArray
// module.exports = [
//   {
//     path: 'CloudOS' + jlsd,
//     component: () => import('@/views/fileManager/fileList/product'),
//     name: 'CloudOS',
//     meta: { title: 'CloudOS' },
//     children: [
//       {
//         path: 'iso',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'CloudOS/iso',
//         meta: { title: 'iso文件' }
//       },
//       {
//         path: 'installer',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'CloudOS/installer',
//         meta: { title: '安装包' }
//       },
//       {
//         path: 'doc',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'CloudOS/doc',
//         meta: { title: '文档' }
//       },
//       {
//         path: 'others',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'CloudOS/others',
//         meta: { title: '其他' }
//       }
//     ]
//   },
//   {
//     path: 'CAS',
//     component: () => import('@/views/fileManager/fileList/product'),
//     name: 'CAS',
//     meta: { title: 'CAS' },
//     children: [
//       {
//         path: 'iso',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'CAS/iso',
//         meta: { title: 'iso文件' }
//       },
//       {
//         path: 'installer',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'CAS/installer',
//         meta: { title: '安装包' }
//       },
//       {
//         path: 'doc',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'CAS/doc',
//         meta: { title: '文档' }
//       },
//       {
//         path: 'others',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'CAS/others',
//         meta: { title: '其他' }
//       }
//     ]
//   },
//   {
//     path: 'ONEStor',
//     component: () => import('@/views/fileManager/fileList/product'),
//     name: 'ONEStor',
//     meta: { title: 'ONEStor' },
//     children: [
//       {
//         path: 'iso',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'ONEStor/iso',
//         meta: { title: 'iso文件' }
//       },
//       {
//         path: 'installer',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'ONEStor/installer',
//         meta: { title: '安装包' }
//       },
//       {
//         path: 'doc',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'ONEStor/doc',
//         meta: { title: '文档' }
//       },
//       {
//         path: 'others',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'ONEStor/others',
//         meta: { title: '其他' }
//       }
//     ]
//   },
//   {
//     path: 'SNA',
//     component: () => import('@/views/fileManager/fileList/product'),
//     name: 'SNA',
//     meta: { title: 'SNA' },
//     children: [
//       {
//         path: 'iso',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'SNA/iso',
//         meta: { title: 'iso文件' }
//       },
//       {
//         path: 'installer',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'SNA/installer',
//         meta: { title: '安装包' }
//       },
//       {
//         path: 'doc',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'SNA/doc',
//         meta: { title: '文档' }
//       },
//       {
//         path: 'others',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'SNA/others',
//         meta: { title: '其他' }
//       }
//     ]
//   },
//   {
//     path: 'UCenter',
//     component: () => import('@/views/fileManager/fileList/product'),
//     name: 'UCenter',
//     meta: { title: 'UCenter' },
//     children: [
//       {
//         path: 'iso',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'UCenter/iso',
//         meta: { title: 'iso文件' }
//       },
//       {
//         path: 'installer',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'UCenter/installer',
//         meta: { title: '安装包' }
//       },
//       {
//         path: 'doc',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'UCenter/doc',
//         meta: { title: '文档' }
//       },
//       {
//         path: 'others',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'UCenter/others',
//         meta: { title: '其他' }
//       }
//     ]
//   },
//   {
//     path: 'OMP',
//     component: () => import('@/views/fileManager/fileList/product'),
//     name: 'OMP',
//     meta: { title: 'OMP' },
//     children: [
//       {
//         path: 'iso',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'OMP/iso',
//         meta: { title: 'iso文件' }
//       },
//       {
//         path: 'installer',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'OMP/installer',
//         meta: { title: '安装包' }
//       },
//       {
//         path: 'doc',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'OMP/doc',
//         meta: { title: '文档' }
//       },
//       {
//         path: 'others',
//         component: () => import('@/views/fileManager/fileList/file'),
//         name: 'OMP/others',
//         meta: { title: '其他' }
//       }
//     ]
//   }
// ]

