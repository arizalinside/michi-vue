import axios from 'axios'

export default {
  state: {
    category: [],
    categoryItem: [],
    categoryId: null
  },
  mutations: {
    setCategory(state, payload) {
      // console.log(payload)
      state.categoryItem = []
      payload.data.map((value) => {
        const setCategory = {
          ID: value.category_id,
          Name: value.category_name,
          Created: value.category_created_at.slice(0, 10),
          Updated: value.category_updated_at.slice(0, 10)
        }
        state.categoryItem = [...state.categoryItem, setCategory]
        // console.log(value)
      })
    }
  },
  actions: {
    getCategories(context, payload) {
      axios.get('http://127.0.0.1:3001/category')
        .then((response) => {
          // console.log(response.data)
          context.commit('setCategory', response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addCategories(context, payload) {
      // console.log(payload)
      return new Promise((resolve, reject) => {
        axios
          .post('http://127.0.0.1:3001/category', payload)
          .then((response) => {
            // console.log(response)
            resolve(response.data)
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },
    deleteCategory(context, payload) {
      // console.log(payload)
      context.state.categoryId = payload.item.ID
      axios
        .delete(`http://127.0.0.1:3001/category/${context.state.categoryId}`)
        .then((response) => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
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
