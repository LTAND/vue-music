import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug, // state的数据的修改是不是通过mutation，如果不是则报错
  plugins: debug ? [createLogger()] : [] // plugins是数组，使用vuex的插件，控制台打印mutations的修改记录
})
