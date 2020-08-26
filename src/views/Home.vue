<template>
  <div class="home">
    <b-container fluid>
      <b-row>
        <b-col cols="12" lg="8" class="header">
          <Header text="Menu" />
        </b-col>

        <b-col cols="12" lg="4" class="header-cart">
          <p>Cart</p>
          <b-badge></b-badge>
        </b-col>
      </b-row>
      <b-sidebar
        id="sidebar-backdrop"
        :title="msg"
        backdrop-variant="dark"
        backdrop
        shadow
      >
        <Sidebar />
      </b-sidebar>
      <b-row>
        <b-col cols="12" lg="8">
          <b-form v-on:submit.prevent="searchProduct" inline>
            <b-input
              placeholder="Search.."
              v-model="keyword"
              class="search-item"
            ></b-input>
          </b-form>
          <b-row>
            <b-col
              cols="12"
              lg="4"
              class="item-menu"
              v-for="(item, index) in products"
              :key="index"
            >
              <b-card
                :title="item.product_name"
                img-src="https://picsum.photos/600/300/?image=25"
                img-alt="Image"
                img-top
                tag="article"
                class="mb-2"
              >
                <b-card-text>
                  <p>
                    Rp.
                    {{ item.product_price }}
                  </p>
                </b-card-text>

                <b-button href="#" variant="primary">Go somewhere</b-button>
              </b-card>
            </b-col>
            <div class="mt-3 item-pagination">
              <b-pagination
                v-model="currentPage"
                pills
                :total-rows="totalData"
                :per-page="limit"
                @change="pageChange"
                v-show="showPagination"
              ></b-pagination>
            </div>
          </b-row>
        </b-col>
        <b-col cols="12" lg="4" class="item-cart"> </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import Header from '@/components/_base/Header.vue'
import Sidebar from '@/components/_base/Sidebar.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Sidebar
  },
  data() {
    return {
      title: 'Michi POS',
      cart: [],
      page: 1,
      limit: 6,
      sort: 'product_name',
      keyword: '',
      products: [],
      showPagination: true
    }
  },
  created() {
    this.get_product()
  },
  methods: {
    get_product() {
      axios
        .get(
          `http://127.0.0.1:3001/product?page=${this.page}&limit=${this.limit}&sort=${this.sort}`
        )
        .then(response => {
          this.products = response.data.data
          console.log(this.products)
        })
        .catch(error => {
          console.log(error)
        })
    },
    searchProduct() {
      if (this.keyword === '') {
        this.getProduct()
        this.showPagination = true
      } else {
        axios
          .get(`http://127.0.0.1:3001/product/search?search=${this.keyword}`)
          .then(response => {
            this.showPagination = false
            this.product = response.data.data.searchResult
            this.totalData = response.data.data.totalData
          })
      }
    }
  },
  computed: {
    msg: {
      get() {
        return this.title
      }
    }
  }
}
</script>

<style scoped src="@/assets/css/style.css"></style>
