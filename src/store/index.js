import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    detail: {},
    settings: {
      sidebarLogo: ''
    },
    isOpen: false,
    aboutId: 33,
    adminUser: {
      loginUserName: ''
    },
    token: '',
    imgUrl: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.QyT8CYs4Me-mZi9LfEDNtQHaHa?w=192&h=192&c=7&r=0&o=5&dpr=2.2&pid=1.7',
    userUrl: 'https://haise.oss-cn-fuzhou.aliyuncs.com/carousel1.png',
    loginBackgroundImage: 'https://haise.oss-cn-fuzhou.aliyuncs.com/carousel1.png',
    categoryIcon: 'https://haise.oss-cn-fuzhou.aliyuncs.com/carousel1.png'
  },
  mutations: {
    adminUser: function(state, adminUser) {
      state.adminUser = adminUser
    }
  },
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
