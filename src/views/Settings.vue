<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" class="header">
        <Header text="Setting" />
      </b-col>

      <b-col cols="12" class="setting-content">
        <b-card no-body class="tab">
          <b-tabs pills card vertical>
            <b-tab title="Product" active>
              <div style="width: 100%">
                <b-row>
                  <b-col lg="6" class="my-1">
                    <b-button
                      style="border: none; background-color: #82de3a"
                      v-b-modal.modal-1
                      @click="addButton()"
                      >Add Product</b-button
                    >
                  </b-col>
                  <b-col lg="6" class="my-1">
                    <b-form-group>
                      <b-input-group size="sm">
                        <b-form-input
                          v-model="filter"
                          type="search"
                          placeholder="Type to Search"
                          @click="page = 1"
                        ></b-form-input>
                        <b-input-group-append>
                          <b-button :disabled="!filter" @click="filter = ''"
                            >Clear</b-button
                          >
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-table
                  id="product-table"
                  responsive
                  striped
                  hover
                  :items="productItem"
                  :fields="fields"
                  :filter="filter"
                  :filterIncludedFields="['Name']"
                  :per-page="limit"
                  :current-page="page"
                  style="text-align: center"
                >
                  <template #cell(actions)="data">
                    <b-button
                      class="mr-1"
                      variant="info"
                      v-b-modal.modal-1
                      @click="setProduct(data)"
                      >Edit</b-button
                    >
                    <b-button
                      class="ml-1"
                      v-b-modal.modal-3
                      style="background: #d34d4d"
                      @click="showDelBoxProd(data)"
                      >Delete</b-button
                    >
                  </template>
                </b-table>
                <b-pagination
                  v-model="page"
                  v-show="!filter"
                  :total-rows="totalData"
                  :per-page="limit"
                  align="center"
                  class="my-0"
                  aria-controls="product-table"
                ></b-pagination>
              </div>
            </b-tab>

            <b-tab title="Category">
              <div style="width: 100%">
                <b-row>
                  <b-col lg="6" class="my-1">
                    <b-button
                      class="mb-2"
                      style="border: none; background-color: #82de3a"
                      v-b-modal.modal-2
                      @click="addCatButton()"
                      >Add Category</b-button
                    >
                  </b-col>
                </b-row>
                <b-table
                  striped
                  responsive
                  hover
                  :items="categoryItem"
                  :fields="fieldsCategory"
                  style="text-align: center"
                >
                  <template #cell(actions)="data">
                    <b-button
                      class="mr-1"
                      v-b-modal.modal-2
                      @click="setCategory(data)"
                      variant="info"
                      >Edit</b-button
                    >
                    <b-button
                      class="ml-1"
                      style="background: #d34d4d"
                      @click="showDelBoxCat(data)"
                      >Delete</b-button
                    >
                  </template>
                </b-table>
              </div>
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>

    <b-modal id="modal-1" :title="modalTitle" hide-footer v-if="showModal">
      <b-form v-on:submit.prevent="addProduct">
        <b-form-group label-cols-sm="3" label="Name" label-for="nested-name">
          <b-form-input
            id="nested-name"
            v-model="form.product_name"
          ></b-form-input>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Price" label-for="nested-price">
          <b-form-input
            id="nested-price"
            v-model="form.product_price"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Category"
          label-for="nested-category"
        >
          <b-form-select v-model="form.category_id" id="nested-category">
            <option
              v-for="(selectOption, indexOpt) in category"
              :key="indexOpt"
              :value="selectOption.category_id"
            >
              {{ selectOption.category_name }}
            </option>
          </b-form-select>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Status"
          label-for="nested-product"
        >
          <b-form-select
            v-model="form.product_status"
            :options="options"
            id="nested-product"
          >
          </b-form-select>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Image" label-for="nested-image">
          <b-form-file id="nested-image" @change="uploadFile"> </b-form-file>
          <br />
          <span style="color: grey">(Max. 2MB)</span>
        </b-form-group>

        <b-button type="submit" variant="primary" v-show="!isUpdate"
          >Submit</b-button
        >
        <b-button
          type="button"
          variant="primary"
          v-show="isUpdate"
          @click.prevent="updateProduct()"
          >Update</b-button
        >
      </b-form>
    </b-modal>

    <b-modal id="modal-2" :title="modalTitle" hide-footer v-if="showModal">
      <b-form @submit.prevent="addCategory" v-model="showModal">
        <b-form-group label-cols-sm="3" label="Name" label-for="nested-name">
          <b-form-input
            id="nested-name"
            v-model="formCategory.category_name"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" v-show="!isUpdate"
          >Submit</b-button
        >
        <b-button
          type="button"
          variant="primary"
          v-show="isUpdate"
          @click.prevent="patchCategory()"
          >Update</b-button
        >
      </b-form>
    </b-modal>

    <b-sidebar
      id="sidebar-backdrop"
      :title="msg"
      backdrop-variant="dark"
      backdrop
      shadow
    >
      <Sidebar />
    </b-sidebar>
  </b-container>
</template>

<script>
import axios from 'axios'
import Header from '@/components/_base/Header'
import Sidebar from '@/components/_base/Sidebar'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Settings',
  components: {
    Header,
    Sidebar
  },
  data() {
    return {
      title: 'Michi POS',
      // user: 'Pevita Pearce',
      modalTitle: '',
      form: {
        product_name: '',
        product_price: '',
        category_id: '',
        product_image: '',
        product_status: ''
      },
      formCategory: {
        category_name: ''
      },
      fields: [
        {
          key: 'Name',
          sortable: true
        },
        {
          key: 'Image',
          sortable: false
        },
        {
          key: 'Price',
          sortable: true
        },
        {
          key: 'Category',
          sortable: true
        },
        {
          key: 'Created',
          sortable: true
        },
        {
          key: 'Updated',
          sortable: false
        },
        { key: 'actions', label: 'Actions' }
      ],
      fieldsCategory: [
        // { key: 'category_id', label: 'ID' },
        { key: 'ID', label: 'ID' },
        { key: 'Name', label: 'Name' },
        { key: 'Created', label: 'Created' },
        { key: 'Updated', label: 'Updated' },
        { key: 'Actions', label: 'Actions' }
      ],
      filter: null,
      // product: [],
      // category: [],
      // productItem: [],
      // categoryItem: [],
      // productId: null,
      // categoryId: null,
      isUpdate: false,
      page: 1,
      // totalData: 0,
      // limit: 50,
      options: [
        { value: 0, text: 'Not Available' },
        { value: 1, text: 'Available' }
      ],
      showModal: true
    }
  },
  methods: {
    ...mapActions([
      'getProductSetting',
      'addProducts',
      'patchProduct',
      'getCategories',
      'addCategories',
      'deleteCategory'
    ]),
    // getCategory() {
    //   axios
    //     .get('http://127.0.0.1:3001/category')
    //     .then((response) => {
    //       // console.log(this.category)
    //       // console.log(response.data.data)
    //       this.category = response.data.data
    //       this.category.map((value) => {
    //   const setCategory = {
    //     ID: value.category_id,
    //     Name: value.category_name,
    //     Created: value.category_created_at.slice(0, 10),
    //     Updated: value.category_updated_at.slice(0, 10)
    //   }
    //   this.categoryItem = [...this.categoryItem, setCategory]
    // })
    //       // console.log(this.categoryItem)
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //     })
    // },
    addButton() {
      this.form = {
        category_id: '',
        product_name: '',
        product_image: '',
        product_price: '',
        product_status: ''
      }
      this.modalTitle = 'Add Product'
      this.isUpdate = false
    },
    addCatButton() {
      this.formCategory = {
        category_name: ''
      }
      this.modalTitle = 'Add Category'
      this.isUpdate = false
    },
    addProduct() {
      const data = new FormData()
      data.append('product_name', this.form.product_name)
      data.append('product_price', this.form.product_price)
      data.append('category_id', this.form.category_id)
      data.append('product_status', this.form.product_status)
      data.append('product_image', this.form.product_image)
      this.addProducts(data)
        .then(response => {
          this.$bvToast.toast(`${response.msg}`, {
            title: 'Notification',
            variant: 'success',
            solid: true
          })
          this.getProductSetting()
          this.showModal = false
        })
        .catch(error => {
          this.$bvToast.toast(`${error.data.msg}`, {
            title: 'Notification',
            variant: 'danger',
            solid: true
          })
        })
    },
    setProduct(data) {
      // console.log(data)
      this.modalTitle = 'Edit Product'
      this.form = {
        product_name: data.item.Name,
        product_price: data.item.price,
        category_id: data.item.Category,
        product_status: data.product_status,
        product_image: data.item.Image
      }
      this.isUpdate = true
      this.productId = data.item.ID
    },
    uploadFile(event) {
      this.form.product_image = event.target.files[0]
    },
    addCategory() {
      // console.log(this.formCategory.category_name)
      // const data = new FormData()
      // data.append('category_name', this.formCategory.category_name)
      this.addCategories(this.formCategory)
        // this.showModal = false
        .then(response => {
          // console.log(response)
          this.$bvToast.toast(`${response.msg}`, {
            title: 'Notification',
            variant: 'success',
            solid: true
          })
          this.getCategories()
          this.showModal = false
        })
        .catch(error => {
          console.log(error)
          this.$bvToast.toast(`${error.data.msg}`, {
            title: 'Notification',
            variant: 'danger',
            solid: true
          })
        })
    },
    setCategory(data) {
      console.log(data)
      this.isUpdate = true
      this.modalTitle = 'Edit Category'
      this.formCategory = {
        category_name: data.item.Name
      }
      this.categoryId = data.item.ID
    },
    updateProduct() {
      const data = new FormData()
      data.append('product_name', this.form.product_name)
      data.append('product_price', this.form.product_price)
      data.append('category_id', this.form.category_id)
      data.append('product_status', this.form.product_status)
      data.append('product_image', this.form.product_image)
      const setData = {
        product_id: this.productId,
        form: data
      }
      this.isUpdate = false
      this.patchProduct(setData)
      this.showModal = false
    },
    patchCategory() {
      axios
        .patch(
          `http://127.0.0.1:3001/category/${this.categoryId}`,
          this.formCategory
        )
        .then(response => {
          location.reload()
          this.isUpdate = false
          this.showModal = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    showDelBoxProd(data) {
      this.$bvModal
        .msgBoxConfirm(`Are you sure want to delete ${data.item.Name} ?`, {
          title: 'Delete Product',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value === true) {
            this.deleteProduct(data)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    showDelBoxCat(data) {
      // this.deleteCategory(data)
      this.$bvModal
        .msgBoxConfirm(`Are you sure want to delete ${data.item.Name} ?`, {
          title: 'Delete Category',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value === true) {
            this.deleteCategory(data)
            this.getCategories()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteProduct(data) {
      this.productId = data.item.ID
      axios
        .delete(`http://127.0.0.1:3001/product/${this.productId}`)
        .then(response => {
          location.reload()
        })
        .catch(error => {
          console.log(error)
        })
    }
    // deleteCategory(data) {
    //   console.log(data)
    // this.categoryId = data.item.category_id
    // axios
    //   .delete(`http://127.0.0.1:3001/category/${this.categoryId}`)
    //   .then((response) => {
    //     location.reload()
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
    // },
  },
  created() {
    this.getProductSetting()
    this.getCategories()
  },
  computed: {
    ...mapGetters({
      productItem: 'getProductSetting',
      categoryItem: 'getCategoryItem',
      category: 'getCategory',
      categoryId: 'getCategoryId',
      totalData: 'getTotalData',
      limit: 'getLimit',
      product: 'getProduct'
    }),
    msg: {
      get() {
        return this.title
      }
    }
  }
}
</script>
