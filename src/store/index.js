import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isOpen: false,
    aboutId: 33,
    adminUser: {
      loginUserName: ''
    },
    token: '',
    imgUrl: '',
    userUrl: 'https://renrenzi.top/imgs/group1/M00/00/00/rB8AYWJUOduASibLAAAarki5D1k853.png',
    loginBackgroundImage: 'https://renrenzi.top/imgs/group1/M00/00/00/rB8AYWI9vm-AD_vUAAFoAcumkJ4421.png',
    categoryIcon: 'https://renrenzi.top/imgs/group1/M00/00/00/rB8AYWJUKz2AbqXZAAfLnOwKEG0943.jpg'
  },
  mutations: {
    adminUser: function (state, adminUser) {
      state.adminUser = adminUser;
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
