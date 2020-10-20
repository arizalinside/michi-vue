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
<<<<<<< HEAD
        axios.get(`${process.env.VUE_APP_URL}/category`)
          .then((response) => {
            context.commit('setCategory', response.data)
            resolve(response)
          })
          .catch((error) => {
=======
        axios
          .get(`${process.env.VUE_APP_URL}/category`)
          .then(response => {
            context.commit('setCategory', response.data)
            resolve(response)
          })
          .catch(error => {
>>>>>>> 4d1b2f1e7d98a1e1819b3366eee286cb6ed205d9
            reject(error)
          })
      })
    },
    addCategories(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_URL}/category`, payload)
<<<<<<< HEAD
          .then((response) => {
            resolve(response.data)
          })
          .catch((error) => {
=======
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
>>>>>>> 4d1b2f1e7d98a1e1819b3366eee286cb6ed205d9
            reject(error)
          })
      })
    },
    deleteCategory(context, payload) {
      return new Promise((resolve, reject) => {
        context.state.categoryId = payload.item.ID
        axios
<<<<<<< HEAD
          .delete(`${process.env.VUE_APP_URL}/category/${context.state.categoryId}`)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
=======
          .delete(
            `${process.env.VUE_APP_URL}/category/${context.state.categoryId}`
          )
          .then(response => {
            resolve(response)
          })
          .catch(error => {
>>>>>>> 4d1b2f1e7d98a1e1819b3366eee286cb6ed205d9
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
