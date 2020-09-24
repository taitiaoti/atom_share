import Vue from 'vue'
import Router from 'vue-router'
import ProductDetail from '@/views/productDetail'
import giftExchange from '@/views/giftExchange'
import Error from '@/components/err-500'

import { getQueryString } from '@/utils/util'


Vue.use(Router)

let productNo = getQueryString('productNo');
let appId = getQueryString('appId');
let uid = getQueryString('uid');
let title,name,component;
if(uid){
  title = '商品详情';
  name = 'ProductDetail';
  component = ProductDetail;
}else{
  title = '礼品兑换';
  name = 'giftExchange';
  component = giftExchange;
}

export default new Router({
  routes: [
    {
      path: '/',
      name: name,
      meta: {
        title: title
      },
      component: component
    },
    // {
    //   path: '/',
    //   name: 'index',
    //   meta: {
    //     title: 'title'
    //   },
    //   component:()=>import(/* webpackChunkName:'order' */"@/views/index")
    // },
    {
      path: '/order',
      name: 'order',
      meta: {
        title: '确认领取'
      },
      component:()=>import(/* webpackChunkName:'order' */"@/views/order")
    },
    {
      path: '/address',
      name: 'address',
      meta: {
        title: '地址管理'
      },
      component:()=>import(/* webpackChunkName:'order' */"@/views/address")
    },
    {
      path: '/500',
      name: 'error',
      meta: {
        title: '500'
      },
      component: Error
    }
  ]
})
