<template>
  <div class="history">
    <b-container fluid>
      <b-row>
        <b-col cols="12" lg="12" class="header">
          <Header text="History" />
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

      <b-row class="history-container" style="margin: 20px;">
        <b-col cols="12" class="history-details">
          <b-row>
            <b-col cols="12" lg="4" md="6">
              <article class="today-income">
                <div class="article-container">
                  <p>Today's Income</p>
                  <h3>Rp. {{ todayIncome }}</h3>
                  <p v-if="todayIncome > prevIncome">
                    +{{ profitGrowth() }}% Yesterday
                  </p>
                  <p v-else-if="todayIncome < prevIncome">
                    {{ profitGrowth() }}% Yesterday
                  </p>
                </div>
              </article>
            </b-col>

            <b-col cols="12" lg="4" md="6">
              <article class="orders">
                <div class="article-container">
                  <p>Orders</p>
                  <h3>Rp. {{ countThisWeek }}</h3>
                  <p v-if="countThisWeek > countPrevWeek">
                    +{{ orderGrowth() }}% Last Week
                  </p>
                  <p v-else-if="countThisWeek < countPrevWeek">
                    {{ orderGrowth() }}% Last Week
                  </p>
                </div>
              </article>
            </b-col>

            <b-col cols="12" lg="4" md="6">
              <article class="year-income">
                <div class="article-container">
                  <p>This Year's Income</p>
                  <h3>Rp. {{ yearIncome }}</h3>
                  <p v-if="yearIncome > prevYearIncome">
                    +{{ yearGrowth() }}% Last Year
                  </p>
                  <p v-else-if="yearIncome < prevYearIncome">
                    {{ yearGrowth() }}% Last Year
                  </p>
                </div>
              </article>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row class="revenue" style="margin: 30px;">
        <b-col cols="12" class="revenue-header">
          <p>Revenue</p>
          <b-dropdown
            size="sm"
            :text="month"
            variant="outline-danger"
            class="m-2 revenue-list"
          >
            <b-dropdown-item @click="chartJan()">January</b-dropdown-item>
            <b-dropdown-item @click="chartFeb()">February</b-dropdown-item>
            <b-dropdown-item @click="chartMar()">March</b-dropdown-item>
            <b-dropdown-item @click="chartApr()">April</b-dropdown-item>
            <b-dropdown-item @click="chartMay()">May</b-dropdown-item>
            <b-dropdown-item @click="chartJun()">June</b-dropdown-item>
            <b-dropdown-item @click="chartJul()">July</b-dropdown-item>
            <b-dropdown-item @click="chartAug()">August</b-dropdown-item>
            <b-dropdown-item @click="chartSep()">September</b-dropdown-item>
            <b-dropdown-item @click="chartOct()">October</b-dropdown-item>
            <b-dropdown-item @click="chartNov()">November</b-dropdown-item>
            <b-dropdown-item @click="chartDec()">December</b-dropdown-item>
          </b-dropdown>
        </b-col>
        <line-chart :data="chartData">
          <canvas
            width="1000"
            height="300"
            class="chartjs-render-monitor"
          ></canvas>
        </line-chart>
      </b-row>

      <b-row class="recent-order" style="margin: 30px;">
        <b-col
          cols="12"
          class="recent-order-header"
          style="padding: 30px 50px 30px 30px;"
        >
          <p style="font-size: 30px;">Recent Order</p>
          <b-dropdown
            size="sm"
            :text="text"
            variant="outline-danger"
            class="m-2 recent-order-dd"
          >
            <b-dropdown-item href="getHistoryToday">Today</b-dropdown-item>
            <b-dropdown-item href="getHistoryWeek">This week</b-dropdown-item>
            <b-dropdown-item href="getHistoryMonth">This month</b-dropdown-item>
          </b-dropdown>
        </b-col>
        <div>
          <b-table
            id="my-table"
            responsive
            striped
            hover
            :items="items"
            :per-page="perPage"
            :current-page="currentPage"
            style="text-align: center"
          ></b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            align="center"
            aria-controls="my-table"
          ></b-pagination>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import Header from '@/components/_base/Header.vue'
import Sidebar from '@/components/_base/Sidebar.vue'

export default {
  name: 'History',
  components: {
    Header,
    Sidebar
  },
  data() {
    return {
      title: 'Michi POS',
      month: 'Month',
      text: 'Today',
      perPage: 6,
      currentPage: 1,
      items: [],
      chartData: [],
      currentDate: new Date().toJSON().slice(0, 10),
      prevDate: new Date(Date.now - 864e5).toJSON().slice(0, 10),
      prevWeek: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 7
      )
        .toJSON()
        .slice(0, 10),
      prevYear: new Date(
        new Date().getFullYear() - 1,
        new Date().getMonth(),
        new Date().getDate()
      )
        .toJSON()
        .slice(0, 10),
      todayIncome: 0,
      prevIncome: 0,
      countThisWeek: 0,
      countPrevWeek: 0,
      yearIncome: 0,
      prevYearIncome: 0,
      history: []
    }
  },
  created() {
    this.getHistoryToday()
    this.getDataChart()
    this.getTodayIncome()
    this.getPrevIncome()
    this.getYearIncome()
    this.getPrevYearIncome()
    this.getCountHistoryWeek()
    this.getCountHistoryLastWeek()
  },
  methods: {
    getHistoryToday() {
      this.items = []
      axios
        .get('http://127.0.0.1:3001/history/today')
        .then(response => {
          this.history = response.data.data
          this.history.map(value => {
            const setItem = {
              INVOICES: `#${value.history_invoice}`,
              CASHIER: this.user,
              DATE: value.history_created_at.slice(0, 10),
              ORDERS: value.orders
                .map(item => item.product_name.concat(` ${item.order_qty}`))
                .join(', '),
              AMOUNT: `Rp. ${value.history_subtotal}`
            }
            this.items = [...this.items, setItem]
          })
          this.text = 'Today'
        })
        .catch(error => {
          console.log(error)
        })
    },
    getiHistoryWeek() {
      this.items = []
      axios
        .get('http://127.0.0.1:3001/history/week')
        .then(response => {
          this.history = response.data.data
          this.history.map(value => {
            const setItem = {
              INVOICES: `#${value.history_invoices}`,
              CASHIER: this.user,
              DATE: value.history_created_at.slice(0, 10),
              ORDERS: value.orders
                .map(item => item.product_name.concat(`${item.order_qty}x`))
                .join(', '),
              AMOUNT: `Rp. ${value.history_subtotal}`
            }
            this.items = [...this.items, setItem]
          })
          this.text = 'This Week'
        })
        .catch(error => {
          console.log(error)
        })
    },
    getHistoryMonth() {
      this.items = []
      axios
        .get('http://127.0.0.1:3001/history/month')
        .then(response => {
          this.history = response.data.data
          this.history.map(value => {
            const setItem = {
              INVOICES: `#${value.history_invoices}`,
              CASHIER: this.user,
              DATE: value.history_created_at.slice(0, 10),
              ORDERS: value.orders
                .map(item => item.product_name.concat(`${item.order_qty}x`))
                .join(', '),
              AMOUNT: `Rp. ${value.history_subtotal}`
            }
            this.items = [...this.items, setItem]
          })
          this.text = 'This Month'
        })
        .catch(error => {
          console.log(error)
        })
    },
    getDataChart() {
      axios
        .get(`http://127.0.0.1:3001/history/chart?date=${this.currentDate}`)
        .then(response => {
          const setChart = response.data.data
          for (let i = 0; i < setChart.length; i++) {
            this.chartData.push([setChart[i].date, setChart[i].sum])
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTodayIncome() {
      axios
        .get(`http://127.0.0.1:3001/history/income?date=${this.currentDate}`)
        .then(response => {
          this.todayIncome = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getPrevIncome() {
      axios
        .get(`http://127.0.0.1:3001/history/income?date=${this.prevDate}`)
        .then(response => {
          this.prevIncome = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getYearIncome() {
      axios
        .get(
          `http://127.0.0.1:3001/history/incomeyear?date=${this.currentDate}`
        )
        .then(response => {
          this.yearIncome = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getPrevYearIncome() {
      axios
        .get(`http://127.0.0.1:3001/history/incomeyear?date=${this.prevYear}`)
        .then(response => {
          this.prevYearIncome = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCountHistoryWeek() {
      axios
        .get(`http://127.0.0.1:3001/history/count?date=${this.currentDate}`)
        .then(response => {
          this.countThisWeek = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCountHistoryLastWeek() {
      axios
        .get(`http://127.0.0.1:3001/history/count?date=${this.prevWeek}`)
        .then(response => {
          this.countPrevWeek = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    profitGrowth() {
      const count =
        ((this.todayIncome - this.prevIncome) / this.prevIncome) * 100
      return Math.ceil(count)
    },
    orderGrowth() {
      const count =
        ((this.countThisWeek - this.countPrevWeek) / this.countPrevWeek) * 100
      return Math.ceil(count)
    },
    yearGrowth() {
      const count =
        ((this.yearIncome - this.prevYearIncome) / this.prevYearIncome) * 100
      return Math.ceil(count)
    },
    chartJan() {
      this.month = 'January'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 0, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartFeb() {
      this.month = 'February'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 1, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartMar() {
      this.month = 'March'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 2, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartApr() {
      this.month = 'April'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 3, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartMay() {
      this.month = 'May'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 4, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartJun() {
      this.month = 'June'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 5, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartJul() {
      this.month = 'July'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 6, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartAug() {
      this.month = 'August'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 7, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartSep() {
      this.month = 'September'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 8, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartOct() {
      this.month = 'October'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 9, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartNov() {
      this.month = 'November'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 10, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    },
    chartDec() {
      this.month = 'December'
      this.chartData = []
      this.currentDate = new Date(new Date().getFullYear(), 11, 2)
        .toJSON()
        .slice(0, 10)
      console.log(this.currentDate)
      this.getDataChart()
    }
  },
  computed: {
    msg: {
      get() {
        return this.title
      }
    },
    rows() {
      return this.items.length
    }
  }
}
</script>

<style src="@/assets/css/history.css"></style>
