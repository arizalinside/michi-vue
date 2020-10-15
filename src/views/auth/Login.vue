<template>
  <b-form @submit.prevent="onSubmit">
    <b-card class="login-card">
      <p class="h4 text-center mb-4 sign-in">Sign in</p>
      <label for="defaultFormLoginEmailEx" class="grey-text">Email</label>
      <input
        type="email"
        v-model="form.user_email"
        class="form-control"
        required
      />
      <br />

      <label for="defaultFormLoginPasswordEx" class="grey-text">Password</label>
      <input
        type="password"
        v-model="form.user_password"
        class="form-control"
      />
      <div class="text-center mt-4">
        <button
          class="btn btn-indigo login-button"
          type="submit"
          @click="onSubmit"
        >
          Login
        </button>
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          {{ msgError }}
        </b-alert>
        <p class="link text-center mt-2 mb-4">
          Not registered?
          <router-link to="/register">
            <span>Create an account</span>
          </router-link>
        </p>
      </div>
    </b-card>
  </b-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        user_email: '',
        user_password: ''
      },
      showDismissibleAlert: false,
      msgError: ''
    }
  },
  computed: {
    // [1]
    // dataName() {
    //   return this.$store.state.name
    // }
    // [2]
    // ...mapState({ dataName: 'name' })
    // [3]
    ...mapState(['name'])
  },
  methods: {
    ...mapActions(['login']),
    ...mapGetters({ error: 'getError', getUser: 'getUser' }),
    onSubmit() {
      // console.log(this.form)
      this.login(this.form)
        .then((result) => {
          console.log(result)
          this.$router.push('/')
        })
        .catch((error) => {
          this.showDismissibleAlert = true
          this.msgError = error
        })
    },
    onReset() {
      this.form = {
        user_email: '',
        user_password: ''
      }
    },
    error() {}
  }
}
</script>

<style scoped src="@/assets/css/auth.css"></style>
