const productsArray = []
export const roleOptions = ['admin', 'solutionAdmin', 'tester', 'customerService ', 'visitor']
export const productTypes = ['CloudOS', 'CAS', 'ONEStor', 'SNA', 'UCenter', 'OMP', 'CMP', '解决方案']
export const kindTypes = ['iso', 'installer', 'doc', 'others']
productTypes.forEach((product) => {
  productsArray.push({
    productValue: product,
    label: product
  })
})

export const products = productsArray
export const kinds = [{
  kindValue: 'iso',
  label: 'iso文件'
}, {
  kindValue: 'installer',
  label: '安装包'
}, {
  kindValue: 'doc',
  label: '文档'
}, {
  kindValue: 'others',
  label: '其他'
}]
