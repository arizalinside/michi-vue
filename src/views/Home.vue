<template>
  <div class="home">
    <b-container fluid>
      <b-row>
        <b-col cols="12" lg="8" class="header">
          <Header text="Menu" />
        </b-col>

        <b-col cols="12" lg="4" class="header-cart">
          <p>
            Cart
            <b-badge>{{ cartCount() }}</b-badge>
          </p>
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
        <b-col cols="12" lg="8" class="menu-side">
          <b-row class="sort-search">
            <b-form v-on:submit.prevent="search" inline>
              <b-input
                placeholder="Search.."
                v-model="keyword"
                class="search-item"
              ></b-input>
              <b-button
                variant="info"
                type="submit"
                class="search-button ml-md-2"
                >Search</b-button
              >

              <b-dropdown
                id="sort"
                :text="sortText"
                class="m-2"
                variant="info"
                v-show="!isSearch"
              >
                <b-dropdown-item-button @click="sortCategory()" active
                  >Category</b-dropdown-item-button
                >
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-group id="dropdown-group-1" header="Name">
                  <b-dropdown-item-button @click="sortNameAsc()"
                    >A-Z</b-dropdown-item-button
                  >
                </b-dropdown-group>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-group id="dropdown-group-2" header="Date">
                  <b-dropdown-item-button @click="sortDateAsc()"
                    >Newest</b-dropdown-item-button
                  >
                </b-dropdown-group>
                <b-dropdown-divider></b-dropdown-divider>
                <b-dropdown-group id="dropdown-group-3" header="Price">
                  <b-dropdown-item-button @click="sortPriceAsc()"
                    >Lowest</b-dropdown-item-button
                  >
                </b-dropdown-group>
              </b-dropdown>
            </b-form>
          </b-row>
          <b-row class="product-menu">
            <b-col
              cols="12"
              lg="4"
              class="item-menu"
              v-for="(item, index) in product"
              :key="index"
            >
              <b-card
                :title="item.product_name"
                :img-src="'http://127.0.0.1:3001/' + item.product_image"
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

                <b-button
                  pill
                  variant="outline-primary"
                  size="sm"
                  class="atc-button"
                  @click="addCart(item)"
                  v-if="!checkCart(item)"
                  >Add to Cart</b-button
                >
                <b-button
                  pill
                  variant="outline-danger"
                  size="sm"
                  class="atc-button"
                  @click="removeCart(item)"
                  v-else
                  >Remove from Cart</b-button
                >
                <!-- <b-button
                  pill
                  variant="outline-primary"
                  size="sm"
                  class="atc-button"
                  @click="setProduct(item)"
                >Update</b-button>
                <div class="mb-2">
                  <b-button
                    pill
                    variant="outline-primary"
                    size="sm"
                    class="atc-button"
                    @click="showMsgBoxTwo(item)"
                >Delete</b-button>-->
                <!-- </div> -->
              </b-card>
            </b-col>
          </b-row>
          <b-row class="pagination-row">
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

        <b-col cols="12" lg="4" class="item-cart-empty" v-if="cartCount() < 1">
          <img src="@/assets/images/icons/food-and-restaurant.png" alt />
          <p>
            Your cart is empty
            <br />
            <span>Please add some items from the menu</span>
          </p>
        </b-col>

        <b-col cols="12" lg="4" class="item-cart" v-else>
          <div class="cart-overflow">
            <b-row v-for="(item, index) in cart" :key="index" class="cart-list">
              <b-col cols="4">
                <b-img
                  :src="'http://127.0.0.1:3001/' + item.product_image"
                  class="cart-image"
                  fluid
                />
              </b-col>
              <b-col cols="5" style="padding: 0">
                <p class="cart-name">{{ item.product_name }}</p>
                <b-input-group class="qty-group">
                  <b-button
                    class="plus-minus"
                    variant="success"
                    @click="minus(item)"
                    >-</b-button
                  >
                  <input type="text" v-model="item.qty" class="qty" />
                  <b-button
                    class="plus-minus"
                    variant="success"
                    @click="plus(item)"
                    >+</b-button
                  >
                </b-input-group>
              </b-col>
              <b-col cols="3" style="padding: 0" align-self="end">
                <p class="price-cart">
                  Rp. {{ item.product_price * item.qty }}
                </p>
              </b-col>
            </b-row>
          </div>
          <b-row class="checkout">
            <b-col cols="6">
              <p>
                Total:
                <br />
                <span>Tax not included</span>
              </p>
            </b-col>
            <b-col cols="6" style="text-align: end">
              <p>Rp. {{ countTotal() }}</p>
            </b-col>
            <b-button
              class="checkout-btn"
              variant="info"
              style="background: #57cad5"
              @click="postOrder(cart)"
              v-b-modal.modal-checkout
              >Checkout</b-button
            >
            <b-button
              class="cancel-btn"
              variant="danger"
              style="background: #f24f8a"
              @click="cancelCart()"
              >Cancel</b-button
            >
          </b-row>
        </b-col>
      </b-row>

      <b-modal
        id="modal-checkout"
        title="Checkout Success"
        centered
        hide-footer
      >
        <b-row>
          <b-col cols="6">
            <p>Checkout</p>
          </b-col>
          <b-col cols="6" style="text-align: end">
            <p>Receipt no: #{{ invoice }}</p>
          </b-col>
        </b-row>
        <p style="margin-bottom: 50px; font-size: 13px">
          Cashier: {{ user.user_name }}
        </p>
        <b-row v-for="(item, index) in cart" :key="index" class="checkout-list">
          <b-col cols="6">
            <p>{{ item.product_name }} {{ item.qty }}x</p>
          </b-col>
          <b-col cols="6" style="text-align: end">
            <p>Rp. {{ item.product_price * item.qty }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6">
            <p>Tax 10%</p>
          </b-col>
          <b-col cols="6" style="text-align: end">
            <p>Rp. {{ countTotal() * 0.1 }}</p>
          </b-col>
          <b-col cols="12" style="text-align: end">
            <p>Total: Rp. {{ countTotal() + countTotal() * 0.1 }}</p>
          </b-col>
          <b-col cols="12">
            <p>Payment: Cash</p>
          </b-col>
          <b-button
            class="checkout-btn"
            variant="info"
            style="background: #57cad5"
            @click="endCheck()"
            >Print</b-button
          >
        </b-row>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import Header from '@/components/_base/Header.vue'
import Sidebar from '@/components/_base/Sidebar.vue'
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    Header,
    Sidebar
  },
  data() {
    return {
      title: 'Michi POS',
      sortText: 'Sort',
      // totalData: 0,
      // page: 1,
      // limit: 6,
      keyword: '',
      // sort: 'product_name',
      // product: [],
      cart: [],
      setOrder: [],
      img: require('@/assets/images/icons/blank.png'),
      addCartBtn: [],
      showPagination: true,
      invoice: null,
      boxTwo: '',
      currentPage: 1,
      isSearch: false
    }
  },
  created() {
    this.getProduct()
  },
  methods: {
    ...mapActions(['getProduct', 'searchProduct']),
    ...mapMutations(['removeCart', 'sortProduct', 'changePage']),
    // getProduct() {
    //   axios
    //     .get(
    //       `http://127.0.0.1:3001/product?page=${this.page}&limit=${this.limit}&sort=${this.sort}`
    //     )
    //     .then(response => {
    //       this.keyword = ''
    //       this.product = response.data.data.result
    //       this.totalData = response.data.data.pageInfo.totalData
    //       // console.log(response)
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // },
    // searchProduct() {
    //   if (this.keyword === '') {
    //     this.page = 1
    //     this.getProduct()
    //     this.showPagination = true
    //   } else {
    //     axios
    //       .get(`http://127.0.0.1:3001/product/search?keyword=${this.keyword}`)
    //       .then(response => {
    //         // console.log(data)
    //         this.showPagination = false
    //         this.sortText = 'Sort'
    //         this.sort = ''
    //         this.product = response.data.data.searchResult
    //         this.totalData = response.data.data.totalData
    //       })
    //       .catch(error => {
    //         console.log(error)
    //       })
    //   }
    // },
    search() {
      if (this.keyword === '') {
        this.getProduct()
        this.isSearch = false
      } else {
        this.isSearch = true
        this.sortText = 'Sort'
        this.searchProduct(this.keyword)
      }
    },
    sortCategory() {
      this.showPagination = true
      this.sortProduct('category_id')
      this.getProduct()
    },
    sortNameAsc() {
      this.showPagination = true
      this.sortProduct('product_name')
      this.getProduct()
    },
    sortDateAsc() {
      this.showPagination = true
      this.sortProduct('product_created_at')
      this.getProduct()
    },
    sortPriceAsc() {
      this.showPagination = true
      this.sortProduct('product_price')
      this.getProduct()
    },
    addCart(data) {
      const setCart = {
        product_id: data.product_id,
        product_name: data.product_name,
        product_image: data.product_image,
        product_price: data.product_price,
        qty: 1
      }
      this.cart = [...this.cart, setCart]
    },
    checkCart(data) {
      return this.cart.some(item => item.product_id === data.product_id)
    },
    removeCart(data) {
      return this.cart.splice(
        this.cart.findIndex(item => item.product_id === data.product_id),
        1
      )
    },
    minus(data) {
      console.log(data)
      if (data.qty === 1) {
        this.removeCart(data)
      } else {
        data.qty -= 1
      }
    },
    plus(data) {
      data.qty += 1
    },
    pageChange(item) {
      // console.log(item)
      this.changePage(item)
      this.getProduct()
    },
    cartCount() {
      return this.cart.length
    },
    countTotal() {
      let total = 0
      for (let i = 0; i < this.cart.length; i++) {
        total += this.cart[i].product_price * this.cart[i].qty
      }
      return total
    },
    postOrder(data) {
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        const orderData = {
          product_id: data[i].product_id,
          order_qty: data[i].qty
        }
        this.setOrder = [...this.setOrder, orderData]
      }
      const setData = {
        orders: this.setOrder
      }
      axios
        .post('http://127.0.0.1:3001/orders', setData)
        .then(response => {
          this.invoice = response.data.data.history_invoices
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    cancelCart() {
      this.cart = []
    },
    refresh() {
      location.reload()
      return false
    },
    endCheck() {
      this.$bvModal.hide('modal-checkout')
      this.cart = []
      this.makeToast('success')
    },
    makeToast(variant = null) {
      this.$bvToast.toast('Checkout Printed', {
        title: 'Success',
        variant: variant,
        solid: true
      })
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      product: 'getProduct',
      totalData: 'getTotalData',
      limit: 'getLimit',
      page: 'getPage'
    }),
    msg: {
      get() {
        return this.title
      }
    }
  }
}
</script>

<style src="@/assets/css/style.css"></style>
