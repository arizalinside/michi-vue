<template>
  <b-container fluid>
    <b-avatar
      :src="require('@/assets/images/admin/cat.png')"
      size="10em"
    ></b-avatar>
    <h5 class="cashier">{{ user }}</h5>
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
  </b-container>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      user: 'Pevita Pearce'
    }
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
