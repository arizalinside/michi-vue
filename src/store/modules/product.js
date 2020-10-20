import axios from 'axios'

export default {
  state: {
    page: 1,
    limit: 9,
    totalData: 0,
    product: [],
    sort: 'product_name',
    productItem: [],
    productId: null
  },
  mutations: {
    setProduct(state, payload) {
      // console.log(payload.data)
      state.product = payload.data
      state.totalData = payload.pagination.totalData
    },
    changePage(state, payload) {
      // console.log(payload)
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
      state.productItem = []
      payload.data.map(value => {
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
      // console.log(state.totalData)
    }
  },
  actions: {
    getProduct(context) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${process.env.VUE_APP_URL}/product?page=${context.state.page}&limit=${context.state.limit}&sort=${context.state.sort}`
          )
          .then(response => {
            context.commit('setProduct', response.data)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    addProducts(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_URL}/product`, payload)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
    searchProduct(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${process.env.VUE_APP_URL}/product/search?keyword=${payload}`)
          .then(response => {
            context.commit('setSearchResult', response.data.data.searchResult)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getProductSetting(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${process.env.VUE_APP_URL}/product?page=${context.state.page}&limit=100&sort=product_name`
          )
          .then(response => {
            context.commit('setProductSetting', response.data)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    patchProduct(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(
            `${process.env.VUE_APP_URL}/product/${payload.product_id}`,
            payload.form
          )
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
    deleteProduct(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${process.env.VUE_APP_URL}/product/${payload.item.ID}`)
          .then(response => {
            resolve(response)
            // resolve(response.data)
          })
          .catch(error => {
            reject(error)
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
      return state.page
    },
    getProductSetting(state) {
      return state.productItem
    }
  }
}
