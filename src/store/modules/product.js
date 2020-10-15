import axios from 'axios'

export default {
  state: {
    page: 1,
    limit: 6,
    totalData: 0,
    product: [],
    sort: 'product_name',
    productItem: [],
    productId: null
  },
  mutations: {
    setProduct(state, payload) {
      console.log(payload.data)
      state.product = payload.data
      state.totalData = payload.pagination.totalData
    },
    changePage(state, payload) {
      console.log(payload)
      state.page = payload
    },
    sortProduct(state, payload) {
      state.sort = payload
      state.page = 1
    },
    setSearchResult(state, payload) {
      state.product = payload
    },
    setProductSetting(state, payload) {
      // console.log(payload)
      payload.data.map((value) => {
        const setProduct = {
          ID: value.product_id,
          Name: value.product_name,
          Image: value.product_image,
          Price: `Rp. ${value.product_price}`,
          price: value.product_price,
          // category_id: value.category_id,
          Category: value.category_id,
          Created: value.product_created_at.slice(0, 10),
          Updated: value.product_updated_at.slice(0, 10)
        }
        state.productItem = [...state.productItem, setProduct]
        // console.log(setProduct)
        // console.log(this.productItem)
      })
      state.totalData = payload.pagination.totalData
      // console.log(state.productItem)
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
        })
        .catch(error => {
          console.log(error)
        })
    },
    addProducts(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('http://127.0.0.1:3001/product', payload)
          .then(response => {
            // console.log(response)
            resolve(response.data)
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
    searchProduct(context, payload) {
      axios
        .get(`http://127.0.0.1:3001/product/search?keyword=${payload}`)
        .then(response => {
          context.commit('setSearchResult', response.data.data.searchResult)
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    getProductSetting(context, payload) {
      axios
        .get(`http://127.0.0.1:3001/product?page=${context.state.page}&limit=${context.state.limit}&sort=product_name`)
        .then(response => {
          // console.log(response)
          context.commit('setProductSetting', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    patchProduct(context, payload) {
      console.log(payload)
      return new Promise((resolve, reject) => {
        axios
          .patch(`http://127.0.0.1:3001/product/${payload.product_id}`, payload.form)
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.log(error)
          })
      })
    }
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
      console.log(state)
      return state.page
    },
    getProductSetting(state) {
      return state.productItem
    }
  }
}
