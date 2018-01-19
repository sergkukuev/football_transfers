<template lang="html">
  <div id="scouts">
    <div class="notification">
      Number of scouts per page: &nbsp
      <input type="text" v-model="count" v-bind:class="count" v-on:change="get_scouts" style="width:40px"/>
    </div>
    <div class="columns">
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
      <button v-on:click="prev_page" style="margin-left:40%"> << </button>
      &nbsp Page {{page + 1}} &nbsp
      <button v-on:click="next_page"> >> </button>
    </div>
  </div>
</template>

        

<script>
import axios from 'axios'

export default {
  name: 'scouts',
  data: function () {
    return {
      page: 0,
      count: 10,
      scouts: [],
      error: ''
    }
  },
  methods: {
    get_scouts: function () {
      let path = 'http://127.0.0.1:3000/scouts?count=' + this.count + '&page=' + this.page
      axios.get(path).then((response) => {
        this.scouts = response.data
      }, (err) => {
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
    }
  },
  mounted: function () {
    this.get_scouts()
  }
}
</script>

<style lang="css">
</style>
