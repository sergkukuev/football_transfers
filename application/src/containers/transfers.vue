<template lang="html">
  <div id="transfers">
    <div class="notification">
      Number of transfers per page: &nbsp
      <input type="text" v-model="count" v-bind:class="count" v-on:change="get_transfers" style="width:40px"/>
    </div>
    <div class="columns">
      <table class="table">
        <thead>
          <tr>
            <th>Player ID</th>
            <th>Scout ID</th>
            <th>Cost</th>
            <th>Date</th>
            <th>ClubFrom</th>
            <th>ClubTo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in transfers">
            <td>{{item.playerID}}</td>
            <td>{{item.scoutID}}</td>
            <td>{{item.cost}}</td>
            <td>{{item.dateOfSign}}</td>
            <td>{{item.club.from}}</td>
            <td>{{item.club.to}}</td>
          </tr>
        </tbody>
      </table>
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
  name: 'transfers',
  data: function () {
    return {
      page: 0,
      count: 10,
      transfers: [],
      error: ''
    }
  },
  methods: {
    get_transfers: function () {
      let path = 'http://127.0.0.1:3000/transfers?count=' + this.count + '&page=' + this.page
      axios.get(path).then((response) => {
        this.transfers = response.data
      }, (err) => {
        console.log(err)
      })
    },
    prev_page: function () {
      if (this.page > 0) {
        --this.page
        this.get_transfers()
      }
    },
    next_page: function () {
      ++this.page
      this.get_transfers()
      if (this.transfers.length === 0) {
        this.prev_page()
      }
    }
  },
  mounted: function () {
    this.get_transfers()
  }
}
</script>

<style lang="css">
</style>