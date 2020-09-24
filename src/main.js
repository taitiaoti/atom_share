// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { Swipe, SwipeItem, Lazyload, ImagePreview, Rate, Loading, Icon, Popup, Toast, Field,CellGroup,Area } from 'vant';
Vue.use(Swipe).use(SwipeItem).use(Lazyload, {loading:require('./assets/default-pic.png')}).use(ImagePreview).use(Rate).use(Loading).use(Icon).use(Popup).use(Toast).use(Field).use(CellGroup).use(Area);
Vue.config.productionTip = false
Vue.use(require('vue-wechat-title'))

/* eslint-disable no-new */

router.beforeEach((to,from,next) => {
  window.document.title = to.meta.title;
  next();
})

window.vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
