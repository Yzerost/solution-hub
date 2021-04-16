import productTypes from './product'
const productsArray = []

productTypes.forEach((product) => {
  productsArray.push({
    productValue: product,
    label: product
  })
})

export const products = productsArray
