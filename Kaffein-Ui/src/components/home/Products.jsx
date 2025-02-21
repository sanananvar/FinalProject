import React from 'react'
import ProductTitle from './prosduct/ProductTitle'
import ProductList from './prosduct/ProductList'
import ProductSlider from './prosduct/ProductSlider'

const Products = () => {
  return (
    <section className='product'>
      <ProductTitle/>
      <ProductList/> 
      <ProductSlider/>
    </section>
  )
}

export default Products
