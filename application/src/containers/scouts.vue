<template lang="html">
  <div id="scouts" v-if="status === 200">
    <div class="notification">
      Number of scouts per page: &nbsp
      <input type="text" v-model="count" v-bind:class="count" v-on:change="update_count" style="width:40px"/>
    </div>
    <div class="table">
      <div class="table">
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
      </div>
    </div>
    <div class="notification">
    {{data}}
      <div class="">
        <button v-on:click="prev_page" style="margin-left:40%"> << </button>
        &nbsp Page {{page + 1}} &nbsp
        <button v-on:click="next_page"> >> </button>
      </div>
    </div>
  </div>
  <div v-else class="notification">
    <label style="margin-left:40%"> {{error.message}} : {{error.response.statusText}} </label>
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
      status: 200,
      error: {}
    }
  },
  methods: {
    get_scouts: function () {
      let path = '/scouts?count=' + this.count + '&page=' + this.page
      API.get(path).then((response) => {
        if (response.data.length === 0) {
          --this.page
        } else {
          this.scouts = response.data
          this.status = response.status
        }
      }, (err) => {
        this.error = err
        this.status = err.response.status
        console.log(err)
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
    this.get_scouts()
  }
}
</script>

<style lang="css">
</style>