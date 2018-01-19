<template lang="html">
  <div id="transfers" v-if="status === 200">
    <div class="notification">
      Number of transfers per page: &nbsp
      <input type="text" v-model="count" v-bind:class="count" v-on:change="update_count" style="width:40px"/>
    </div>
    <div class="table">
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
  name: 'transfers',
  data: function () {
    return {
      page: 0,
      count: 10,
      transfers: [],
      status: 200,
      error: {}
    }
  },
  methods: {
    get_transfers: function () {
      let path = '/transfers?count=' + this.count + '&page=' + this.page
      API.get(path).then((response) => {
        if (response.data.length === 0) {
          --this.page
        } else {
          this.transfers = response.data
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
        this.get_transfers()
      }
    },
    next_page: function () {
      ++this.page
      this.get_transfers()
      if (this.transfers.length === 0) {
        this.prev_page()
      }
    },
    update_count: function () {
      this.page = 0
      this.get_transfers()
    }
  },
  mounted: function () {
    this.get_transfers()
  }
}
</script>

<style lang="css">
</style>