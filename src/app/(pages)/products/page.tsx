import apiServices from '@/services/apiServices'
import React from 'react'

export default function Products() {
  apiServices.getProducts()
  return (
    <div>Products</div>
  )
}
