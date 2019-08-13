import Vue from 'vue'
import Router from 'vue-router'
import ProductDetail from '@/views/productDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ProductDetail',
      meta: {
        title: '商品详情'
      },
      component: ProductDetail
    }
  ]
})
