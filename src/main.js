import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

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
