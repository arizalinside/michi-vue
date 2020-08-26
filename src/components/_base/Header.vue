<template>
  <div class="header-container">
    <b-row>
      <b-col cols="2">
        <img
          :src="require('@/assets/images/icons/menu.png')"
          v-b-toggle.sidebar-backdrop
          style="cursor= pointer;"
        />
      </b-col>
      <b-col cols="8">
        <p>{{ text }}</p>
      </b-col>
      <b-col cols="2">
        <img :src="require('@/assets/images/icons/magnifying-glass.png')" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: ['text']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-container {
  text-align: center;
}

.header-container .col-2 {
  padding-top: 18px;
}

.header-container .col-8 p {
  padding-top: 10px;
  font-size: 32px;
}
</style>
