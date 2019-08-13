// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Swipe, SwipeItem, Lazyload, ImagePreview, Rate, Loading  } from 'vant';
Vue.use(Swipe).use(SwipeItem).use(Lazyload, {loading:require('./assets/default-pic.png')}).use(ImagePreview).use(Rate).use(Loading)
Vue.config.productionTip = false
Vue.use(require('vue-wechat-title'))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
