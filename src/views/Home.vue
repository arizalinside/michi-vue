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
      <b-sidebar id="sidebar-backdrop" :title="msg" backdrop-variant="dark" backdrop shadow>
        <Sidebar />
      </b-sidebar>
      <b-row>
        <b-col cols="12" lg="8" class="menu-side">
          <b-form v-on:submit.prevent="searchProduct" inline>
            <b-input placeholder="Search.." v-model="keyword" class="search-item"></b-input>
            <b-button variant="info" type="submit" class="ml-md-2">Search</b-button>

            <b-dropdown id="sort" :text="sortText" class="m-2 sort-btn" variant="info">
              <b-dropdown-item-button @click="sortCategory()" active>Category</b-dropdown-item-button>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-group id="dropdown-group-1" header="Name">
                <b-dropdown-item-button @click="sortNameAsc()">A-Z</b-dropdown-item-button>
                <b-dropdown-item-button @click="sortNameDesc()">Z-A</b-dropdown-item-button>
              </b-dropdown-group>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-group id="dropdown-group-2" header="Date">
                <b-dropdown-item-button @click="sortDateAsc()">Oldest</b-dropdown-item-button>
                <b-dropdown-item-button @click="sortDateDesc()">Newest</b-dropdown-item-button>
              </b-dropdown-group>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-group id="dropdown-group-3" header="Price">
                <b-dropdown-item-button @click="sortPriceAsc()">Lowest</b-dropdown-item-button>
                <b-dropdown-item-button @click="sortPriceDesc()">Highest</b-dropdown-item-button>
              </b-dropdown-group>
            </b-dropdown>
          </b-form>
          <b-row>
            <b-col cols="12" lg="4" class="item-menu" v-for="(item, index) in product" :key="index">
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

                <b-button
                  pill
                  variant="outline-primary"
                  size="sm"
                  class="atc-button"
                  @click="addCart(item)"
                  v-if="!checkCart(item)"
                >Add to Cart</b-button>
                <b-button
                  pill
                  variant="outline-danger"
                  size="sm"
                  class="atc-button"
                  @click="removeCart(item)"
                  v-else
                >Remove from Cart</b-button>
                <b-button
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
                  >Delete</b-button>
                </div>
              </b-card>
            </b-col>
            <div class="mt-3 item-pagination">
              <b-pagination
                v-model="page"
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
                <b-img :src="img" class="cart-image" fluid />
              </b-col>
              <b-col cols="5" style="padding: 0">
                <p class="cart-name">{{ item.product_name }}</p>
                <b-input-group class="qty-group">
                  <b-button class="plus-minus" variant="success" @click="minus(item)">-</b-button>
                  <input type="text" v-model="item.qty" class="qty" />
                  <b-button class="plus-minus" variant="success" @click="plus(item)">+</b-button>
                </b-input-group>
              </b-col>
              <b-col cols="3" style="padding: 0" align-self="end">
                <p class="price-cart">Rp. {{ item.product_price * item.qty }}</p>
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
            <b-col cols="6" style="text-align: end;">
              <p>Rp. {{ countTotal() }}</p>
            </b-col>
            <b-button
              class="checkout-btn"
              variant="info"
              style="background: #57cad5"
              @click="postOrder(cart)"
              v-b-modal.modal-checkout
            >Checkout</b-button>
            <b-button
              class="cancel-btn"
              variant="danger"
              style="background: #F24F8A;"
              @click="cancelCart()"
            >Cancel</b-button>
          </b-row>
        </b-col>
      </b-row>

      <b-modal id="modal-checkout" title="Checkout Success" centered hide-footer>
        <b-row>
          <b-col cols="6">
            <p>Checkout</p>
          </b-col>
          <b-col cols="6" style="text-align: end;">
            <p>Receipt no: #{{ invoice }}</p>
          </b-col>
        </b-row>
        <p style="margin-bottom: 50px; font-size: 13px;">Cashier: {{ user }}</p>
        <b-row v-for="(item, index) in cart" :key="index" class="checkout-list">
          <b-col cols="6">
            <p>{{ item.product_name }} {{ item.qty }}x</p>
          </b-col>
          <b-col cols="6" style="text-align: end;">
            <p>Rp. {{ item.product_price * item.qty }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="6">
            <p>Tax 10%</p>
          </b-col>
          <b-col cols="6" style="text-align: end;">
            <p>Rp. {{ countTotal() * 0.1 }}</p>
          </b-col>
          <b-col cols="12" style="text-align: end;">
            <p>Total: Rp. {{ countTotal() + countTotal() * 0.1 }}</p>
          </b-col>
          <b-col cols="12">
            <p>Payment: Cash</p>
          </b-col>
          <b-button
            class="checkout-btn"
            variant="info"
            style="background: #57cad5"
            @click="refresh()"
          >Print</b-button>
          <b-button
            class="checkout-btn"
            variant="info"
            style="background: #F24F8A;"
            @click="refresh()"
          >Send Email</b-button>
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

export default {
  name: 'Home',
  components: {
    Header,
    Sidebar
  },
  data() {
    return {
      title: 'Michi POS',
      user: 'Pevita Pearce',
      cart: [],
      page: 1,
      limit: 6,
      sort: 'product_name',
      sortText: 'Sort',
      keyword: '',
      product: [],
      totalData: 0,
      setOrder: [],
      img: require('@/assets/images/icons/blank.png'),
      addCartBtn: [],
      showPagination: true,
      invoice: null,
      boxTwo: ''
    }
  },
  created() {
    this.getProduct()
  },
  methods: {
    getProduct() {
      axios
        .get(
          `http://127.0.0.1:3001/product?page=${this.page}&limit=${this.limit}&sort=${this.sort}`
        )
        .then((response) => {
          this.product = response.data.data
          this.totalData = response.data.pagination.totalData
        })
        .catch((error) => {
          console.log(error)
        })
    },
    searchProduct() {
      if (this.keyword === '') {
        this.getProduct()
        this.showPagination = true
      } else {
        axios
          .get(`http://127.0.0.1:3001/product/search?keyword=${this.keyword}`)
          .then((response) => {
            // console.log(data)
            this.showPagination = false
            this.sortText = 'Sort'
            this.sort = ''
            this.product = response.data.data.searchResult
            this.totalData = response.data.data.totalData
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    sortCategory() {
      this.sortText = 'Category'
      this.sort = 'category_id'
      this.page = 1
      this.showPagination = true
      this.getProduct()
    },
    sortNameAsc() {
      this.sortText = 'Name (A-Z)'
      this.sort = 'product_name ASC'
      this.page = 1
      this.showPagination = true
      this.getProduct()
    },
    sortNameDesc() {
      this.sortText = 'Name (Z-A)'
      this.sort = 'product_name DESC'
      this.page = 1
      this.showPagination = true
      this.getProduct()
    },
    sortDateAsc() {
      this.sortText = 'Date (Newest)'
      this.sort = 'product_created_at ASC'
      this.page = 1
      this.showPagination = true
      this.getProduct()
    },
    sortDateDesc() {
      this.sortText = 'Date (Oldest)'
      this.sort = 'product_created_at DESC'
      this.page = 1
      this.showPagination = true
      this.getProduct()
    },
    sortPriceAsc() {
      this.sortText = 'Price (Lowest)'
      this.sort = 'product_price ASC'
      this.page = 1
      this.showPagination = true
      this.getProduct()
    },
    sortPriceDesc() {
      this.sortText = 'Price (Highest)'
      this.sort = 'product_price DESC'
      this.page = 1
      this.showPagination = true
      this.getProduct()
    },
    addCart(data) {
      const setCart = {
        product_id: data.product_id,
        product_name: data.product_name,
        product_price: data.product_price,
        qty: 1
      }
      this.cart = [...this.cart, setCart]
    },
    checkCart(data) {
      return this.cart.some((item) => item.product_id === data.product_id)
    },
    removeCart(data) {
      return this.cart.splice(
        this.cart.findIndex((item) => item.product_id === data.product_id),
        1
      )
    },
    minus(data) {
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
      this.page = item
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
      for (let i = 0; i < data.length; i++) {
        const dataOrder = {
          product_id: data[i].product_id,
          qty: data[i].qty
        }
        this.setOrder = [...this.setOrder, dataOrder]
      }
      axios
        .post('http://127.0.0.1:3001/order', this.setOrder)
        .then((response) => {
          this.invoice = response.data.data.invoice
        })
        .catch((error) => {
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
    setProduct(data) {
      this.form = {
        product_name: data.product_name,
        category_id: data.category_id,
        product_harga: data.product_harga,
        product_status: data.product_status
      }
      this.isUpdate = true
      this.product_id = data.product_id
    },
    deleteProduct(data) {
      this.productId = data.item.ID
      axios
        .delete(`http://127.0.0.1:3001/product/${this.productId}`)
        .then((response) => {
          location.reload()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    showMsgBoxTwo(data) {
      this.boxTwo = ''
      this.$bvModal
        .msgBoxConfirm(
          `Please confirm that you want to delete ${data.item.product_name}?`,
          {
            title: 'Please Confirm',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true
          }
        )
        .then((value) => {
          this.deleteProduct(data)
        })
        .catch((error) => {
          console.log(error)
        })
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

<style src="@/assets/css/style.css"></style>
