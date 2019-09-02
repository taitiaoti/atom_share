/**
 * axios配置
 */
import axios from 'axios'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { Toast } from 'vant'
import Vue from 'vue';
import router from '../router'
axios.defaults.timeout = 30000  // 超时时间
axios.defaults.withCredentials = true  // 跨域请求，允许保存cookie
if(process.env.NODE_ENV == "production"){
  axios.defaults.baseURL = process.env.BASE_API;
  // axios.defaults.baseURL = "http://ceshi.edawtech.com";

}
Toast.setDefaultOptions({
  duration: 5000
})
NProgress.configure({ showSpinner: false })// NProgress Configuration
axios.interceptors.request.use(config => {
    NProgress.start() // start progress bar
    return config
  }, error => {
    console.log('请求拦截');
    return Promise.reject(error)
});

// HTTPresponse拦截
axios.interceptors.response.use(data => {
    NProgress.done()
    return data
  }, error => {
    NProgress.done()
    let errMsg = error.toString()
    let code = errMsg.substr(errMsg.indexOf('code') + 5)
    Toast.fail('status code '+code+','+errMsg);
    console.log('响应拦截');
    // router.push({path:'/500'})
    return Promise.reject(new Error(error))
  })
  
  export default axios