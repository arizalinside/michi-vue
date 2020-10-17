<template>
  <b-container fluid>
    <b-avatar
      :src="require('@/assets/images/admin/cat.png')"
      size="10em"
    ></b-avatar>
    <h5 class="cashier">{{ user.user_name }}</h5>
    <hr />
    <b-navbar variant="faded" type="light">
      <b-navbar-brand href="/">
        <img
          src="@/assets/images/icons/food.png"
          class="d-inline-block align-top"
          alt="fork"
        />
        <p class="text-sidebar">Main Page</p>
      </b-navbar-brand>
    </b-navbar>
    <b-navbar variant="faded" type="light">
      <b-navbar-brand href="history">
        <img
          src="@/assets/images/icons/publication.png"
          class="d-inline-block align-top"
          alt="fork"
        />
        <p class="text-sidebar">History</p>
      </b-navbar-brand>
    </b-navbar>
    <b-navbar variant="faded" type="light">
      <b-navbar-brand href="settings">
        <img
          src="@/assets/images/icons/settings.png"
          class="d-inline-block align-top"
          alt="fork"
        />
        <p class="text-sidebar">Settings</p>
      </b-navbar-brand>
    </b-navbar>
    <b-navbar variant="faded" type="light" style="cursor: pointer">
      <b-navbar-brand class="mb-1" @click.prevent="isLogout()">
        <img
          src="@/assets/images/icons/exit.png"
          class="d-inline-block align-top"
          alt="fork"
        />
        <p class="text-sidebar">Exit</p>
      </b-navbar-brand>
    </b-navbar>
  </b-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  data() {
    return {
      // user: ''
    }
  },
  methods: {
    ...mapActions(['getProduct', 'logout']),
    // isLogout() {
    //   this.logout()
    // }
    isLogout() {
      this.$bvModal.msgBoxConfirm('Do you want to exit?', {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'Yes',
        cancelTitle: 'No',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      }).then((value) => {
        // console.log(value)
        // console.log('ok berhasil')
        // this.isLogout = value
        value ? this.logout() : this.getProduct()
      }).catch(error => {
        console.log(error)
        // An error occurred
      })
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser'
    })
  }
}
</script>

<style>
.b-avatar {
  margin: 20px 0 0 60px;
}

.b-avatar .b-avatar-img img {
  object-fit: cover;
}

.cashier {
  text-align: center;
  margin-top: 10px;
}

img.d-inline-block.align-top {
  width: 50px;
  float: left;
}

.text-sidebar {
  float: left;
  margin: 7px 0 0 20px;
}
</style>
