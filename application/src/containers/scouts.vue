<template lang="html">
  <div id="scouts">
    <div id="waiting" class="notification" v-if="status === 0">
      Loading...
    </div>
    <div id="scout_list" v-else-if="status == 200">
      <font size="5"> Available scouts: </font>
      <div class="notification" >
        Number of scouts per page: &nbsp
        <input type="text" v-model="count" v-bind:class="count" v-on:change="update_count" style="width:40px"/>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rank</th>
            <th>Amount of Deals</th>
            <th>Amount of Contracts</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in scouts">
            <td>{{item.name}}</td>
            <td>{{item.rank}}</td>
            <td>{{item.amount.deals}}</td>
            <td>{{item.amount.contracts}}</td>
          </tr>
        </tbody>
      </table>
      <div class="notification">
        <div class="">
          <button v-on:click="prev_page" style="margin-left:40%"> << </button>
          &nbsp Page {{page + 1}} &nbsp
          <button v-on:click="next_page"> >> </button>
        </div>
      </div>
    </div>
    <div v-else class="notification">
      <font color="red"> Ooooooops. {{error.message}} : {{error.response.statusText}} </font>
    </div>
  </div>
</template>

<script>
import {API} from './api'

export default {
  name: 'scouts',
  data: function () {
    return {
      page: 0,
      count: 10,
      scouts: [],
      status: 0,
      error: {}
    }
  },
  methods: {
    get_scouts: function () {
      console.log(this.$cookie.get('access_token'))
      let path = '/scouts?count=' + this.count + '&page=' + this.page
      const authorization = `Bearer ${this.$cookie.get('access_token')}`
      API.get(path, { headers: {authorization} }).then((response) => {
        if (response.data.length === 0) {
          --this.page
        } else {
          this.scouts = response.data.content
          this.status = response.status
        }
      }, (err) => {
        this.error = err
        this.status = err.response.status
        if (this.status === 401) {
          window.location = 'http://localhost:8080/login'
        }
      })
    },
    prev_page: function () {
      if (this.page > 0) {
        --this.page
        this.get_scouts()
      }
    },
    next_page: function () {
      ++this.page
      this.get_scouts()
      if (this.scouts.length === 0) {
        this.prev_page()
      }
    },
    update_count: function () {
      this.page = 0
      this.get_scouts()
    }
  },
  mounted: function () {
    let token = this.$cookie.get('access_token')
    if (token.length === 0 || typeof (token) === 'undefined') {
      window.location = 'http://localhost:8080/auth'
    } else {
      this.get_scouts()
    }
  }
}
</script>

<style lang="css">
</style>