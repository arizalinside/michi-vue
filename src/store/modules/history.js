import axios from 'axios'

export default {
  state: {
    items: [],
    history: [],
    perPage: 10,
    text: ''
  },
  mutations: {
    setHistoryToday(state, payload) {
      state.items = []
      payload.data.map(value => {
        const setData = {
          INVOICES: `#${value.history_invoices}`,
          CASHIER: value.user_name,
          DATE: value.history_created_at.slice(0, 10),
          ORDERS: value.orders
            .map(item => item.product_name.concat(` ${item.order_qty}x`))
            .join(', '),
          AMOUNT: `Rp. ${value.history_subtotal}`
        }
        state.items = [...state.items, setData]
      })
      state.text = 'Today'
    },
    setHistoryWeek(state, payload) {
      state.items = []
      payload.data.map(value => {
        const setData = {
          INVOICES: `#${value.history_invoices}`,
          CASHIER: value.user_name,
          DATE: value.history_created_at.slice(0, 10),
          ORDERS: value.orders
            .map(item => item.product_name.concat(` ${item.order_qty}x`))
            .join(', '),
          AMOUNT: `Rp. ${value.history_subtotal}`
        }
        state.items = [...state.items, setData]
      })
      state.text = 'Week'
    },
    setHistoryMonth(state, payload) {
      state.items = []
      payload.data.map(value => {
        const setData = {
          INVOICES: `#${value.history_invoices}`,
          CASHIER: value.user_name,
          DATE: value.history_created_at.slice(0, 10),
          ORDERS: value.orders
            .map(item => item.product_name.concat(` ${item.order_qty}x`))
            .join(', '),
          AMOUNT: `Rp. ${value.history_subtotal}`
        }
        state.items = [...state.items, setData]
      })
      state.text = 'Month'
    }
  },
  actions: {
    getHistoryToday(context) {
      axios
        .get(`${process.env.VUE_APP_URL}/history/today`)
        .then(response => {
          context.commit('setHistoryToday', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getHistoryWeek(context) {
      axios
        .get(`${process.env.VUE_APP_URL}/history/week`)
        .then(response => {
          context.commit('setHistoryWeek', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getHistoryMonth(context) {
      axios
        .get(`${process.env.VUE_APP_URL}/history/month`)
        .then(response => {
          context.commit('setHistoryMonth', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  getters: {
    items(state) {
      return state.items
    },
    history(state) {
      return state.history
    },
    perPage(state) {
      return state.perPage
    },
    currentPage(state) {
      return state.currentPage
    },
    getText(state) {
      return state.text
    }
  }
}
