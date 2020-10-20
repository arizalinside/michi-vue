import axios from 'axios'

export default {
  state: {
    category: [],
    categoryItem: [],
    categoryId: null
  },
  mutations: {
    setCategory(state, payload) {
      state.categoryItem = []
      payload.data.map(value => {
        const setCategory = {
          ID: value.category_id,
          Name: value.category_name,
          Created: value.category_created_at.slice(0, 10),
          Updated: value.category_updated_at.slice(0, 10)
        }
        state.categoryItem = [...state.categoryItem, setCategory]
      })
    }
  },
  actions: {
    getCategories(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_URL}/category`)
          .then(response => {
            context.commit('setCategory', response.data)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    addCategories(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_URL}/category`, payload)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteCategory(context, payload) {
      return new Promise((resolve, reject) => {
        context.state.categoryId = payload.item.ID
        axios
          .delete(
            `${process.env.VUE_APP_URL}/category/${context.state.categoryId}`
          )
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    getCategoryItem(state) {
      return state.categoryItem
    },
    getCategory(state) {
      return state.category
    },
    getCategoryId(state) {
      return state.categoryId
    }
  }
}
