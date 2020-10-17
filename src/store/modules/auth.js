import axios from 'axios'
import router from '../../router/index'

export default {
  state: {
    user: {},
    token: localStorage.getItem('token') || null,
    errorLogin: ''
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      state.token = payload.token
      console.log(payload)
    },
    setError(state, payload) {
      console.log(state)
      console.log(payload)
      state.errorLogin = payload
    },
    delUser(state) {
      state.user = {}
      state.token = null
    }
  },
  actions: {
    login(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('http://127.0.0.1:3001/users/login', payload)
          .then(response => {
            console.log(response)
            context.commit('setUser', response.data.data)
            localStorage.setItem('token', response.data.data.token)
            resolve(response.data)
          })
          .catch(error => {
            console.log(error.response)
            reject(error.response.data.msg)
          })
      })
    },
    register(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post('http://127.0.0.1:3001/users/register', payload)
          .then(response => {
            resolve(response.data)
            // console.log(response)
          })
          .catch(error => {
            reject(error.response)
          })
      })
    },
    logout(context) {
      localStorage.removeItem('token')
      context.commit('delUser')
      router.push('/login')
    },
    interceptorRequest(context) {
      console.log('inteceptor worked!')
      axios.interceptors.request.use(
        function (config) {
          config.headers.Authorization = `Bearer ${context.state.token}`
          // Do something before request is sent
          return config
        },
        function (error) {
          // Do something with request error
          return Promise.reject(error)
        }
      )
    },
    interceptorResponse(context) {
      axios.interceptors.response.use(
        function (response) {
          // Any status code that lie within the range of 2xx cause this function to trigger
          // Do something with response data
          return response
        },
        function (error) {
          console.log(error)
          if (error.response.status === 403) {
            if (
              error.response.data.msg === 'invalid token' ||
              error.response.data.msg === 'invalid siganture'
            ) {
              localStorage.removeItem('token')
              context.commit('delUser')
              router.push('/login')
              alert(
                'Sorry, your token is wrong and you cannot continue to this page'
              )
            } else if (error.response.data.msg === 'jwt expired') {
              localStorage.removeItem('token')
              context.commit('delUser')
              router.push('/login')
              alert('Sorry, your session is timeout')
            }
          }
          return Promise.reject(error)
        }
      )
    }
  },
  getters: {
    isLogin(state) {
      return state.token !== null
    },
    getError(state) {
      return state.errorLogin
    },
    getUser(state) {
      return state.user
    }
  }
}
