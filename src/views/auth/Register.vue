<template>
  <b-form @submit.prevent="onSubmit">
    <b-card class="signup-card">
      <p class="h4 text-center mb-4">Sign up</p>
      <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          {{ msgError }}
        </b-alert>
      <label for="defaultFormLoginEmailEx" class="grey-text">Username</label>
      <input type="text" v-model="form.user_name" class="form-control" />
      <br />

      <label for="defaultFormLoginEmailEx" class="grey-text">Email</label>
      <input type="email" v-model="form.user_email" class="form-control" />
      <br />

      <label for="defaultFormLoginPasswordEx" class="grey-text">Password</label>
      <input
        type="password"
        v-model="form.user_password"
        class="form-control"
      />
      <div class="text-center mt-4">
        <button
          class="btn btn-indigo register-btn"
          type="submit"
          @click="onSubmit"
        >
          Register
        </button>
        <p class="warning text-center mt-2 mb-4" v-show="isError">
          {{ error() }}
        </p>
        <p class="link text-center mt-2 mb-4">
          Already have account?
          <router-link to="/login">
            <span>Login here</span>
          </router-link>
        </p>
      </div>
    </b-card>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        user_name: '',
        user_email: '',
        user_password: ''
      },
      isError: false,
      showDismissibleAlert: false,
      msgError: ''
    }
  },
  methods: {
    ...mapActions(['register']),
    ...mapGetters({ error: 'getError' }),
    onSubmit() {
      this.register(this.form)
        .then(result => {
          // console.log(result)
          this.$bvToast.toast(`${result.msg}`, {
            title: 'Congratulations!',
            variant: 'success',
            solid: true
          })
          this.$router.push('/login')
        })
        .catch(error => {
          this.msgError = error.data.msg
          this.showDismissibleAlert = true
          this.isError = true
          console.log(error)
        })
    }
  }
}
</script>

<style scoped src="@/assets/css/auth.css"></style>
