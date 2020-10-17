import Vue from 'vue'
import Vuex from 'vuex'
import Auth from './modules/auth'
import Product from './modules/product'
import Category from './modules/category'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Auth,
    Product,
    Category
  },
  state: {
    name: 'Arizal'
  },
  mutations: {},
  actions: {},
  getters: {}
})
