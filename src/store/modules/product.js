import axios from 'axios'

export default {
  state: {
    page: 1,
    limit: 6,
    totalData: 0,
    product: [],
    sort: 'product_name'
  },
  mutations: {
    setProduct(state, payload) {
      console.log(payload)
      state.product = payload.data
      state.totalData = payload.pagination.totalData
    },
    changePage(state, payload) {
      state.page = payload
    },
    sortProduct(state, payload) {
      state.sort = payload
    },
    setSearchResult(state, payload) {
      state.product = payload
    }
  },
  actions: {
    getProduct(context) {
      axios
        .get(
          `http://127.0.0.1:3001/product?page=${context.state.page}&limit=${context.state.limit}&sort=${context.state.sort}`
        )
        .then(response => {
          context.commit('setProduct', response.data)
          context.state.product = response.data.data
          context.state.totalData = response.data.pagination.totalData
        })
        .catch(error => {
          console.log(error)
        })
    },
    addProducts(context, payload) {
      //   console.log(payload)
      axios
        .post('http://127.0.0.1:3001/product', payload)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  },
  searchProduct(context, payload) {
    console.log(payload)
    axios
      .get(`http://127.0.0.1:3001/product/search?keyword=${payload}`)
      .then(response => {
        context.commit('setSearchResult', response.data.data.searhcResult)
        context.commit('setProduct', 'product_id')
      })
      .catch(error => {
        console.log(error.response)
      })
  },
  getters: {
    getCart(state) {
      return state.cart
    },
    getLimit(state) {
      return state.limit
    },
    getProduct(state) {
      return state.product
    },
    getTotalData(state) {
      return state.totalData
    },
    getPage(state) {
      return state.page
    }
  }
}
