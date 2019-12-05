import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

// /* eslint-disable no-unused-vars */
// // 所以前面加“eslint-disable no-unused-vars”规避掉eslint语法检查
/* import Vconsole from "vconsole"
if (process.env.NODE_ENV === 'development') {
  // 开发环境中控制台
  console.info("development", new Vconsole())
} */

fastclick.attach(document.body)
// class为needsclick，不阻止点击
Vue.use(VueLazyLoad, {
  // vue-load懒加载
  loading: require('common/image/loading.png')
})
Vue.config.productionTip = false
// Vue.config.devtools = true
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
