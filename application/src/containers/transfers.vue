<template lang="html">
  <div id="transfers">
    <div id="waiting" class="notification" v-if="status === 0">
      Loading...
    </div>
    <div id="history" v-else-if="status === 200">
      <input type="hidden" id="selected" disabled>
      <font size="5">Transfer history:</font>
      <div class="notification">
        Number of transfers per page: &nbsp
        <input type="text" v-model="count" v-bind:class="count" v-on:change="update_count" style="width:40px"/>
      </div>
      <table id="transfer_list" v-on:click="get_info('transfer_list')" class="table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Scout, Rank</th>
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
            <td v-if="item.cost !== 0">{{item.cost}}</td>
            <td v-else>free</td>
            <td>{{item.dateOfSign}}</td>
            <td>{{item.club.from}}</td>
            <td>{{item.club.to}}</td>
          </tr>
        </tbody>
      </table>
      <div class="notification">
        <button v-on:click="prev_page" style="margin-left:40%"> << </button>
        &nbsp Page {{page + 1}} &nbsp
        <button v-on:click="next_page"> >> </button>
      </div>
    </div>
    <div v-else class="notification">
      <font color="red"> {{error.message}} : {{error.response.statusText}} </font>
    </div>
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
      status: 0,
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
          for (let i = 0; i < this.transfers.length; i++) {
            this.get_player(i)
            this.get_scout(i)
          }
        }
      }, (err) => {
        this.error = err
        this.status = err.response.status
        console.log(err)
      })
    },
    get_player: function (i) {
      let path = '/players/' + this.transfers[i].playerID
      API.get(path).then((response) => {
        let player = response.data.name + ', ' + response.data.club
        this.transfers[i].playerID = player
      }, (err) => {
        console.log(err)
      })
    },
    get_scout: function (i) {
      let path = '/scouts/' + this.transfers[i].scoutID
      API.get(path).then((response) => {
        let scout = response.data.name + ', ' + response.data.rank
        this.transfers[i].scoutID = scout
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
    },
    update_count: function () {
      this.page = 0
      this.get_transfers()
    },
    get_info: function (name) {
      let table = document.getElementById(name)
      for (let i = 0; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
          document.getElementById('selected').value = this.rowIndex
        }
      }
      let index = document.getElementById('selected').value
      if (index !== '') {
        console.log('Index = ' + index)
        window.location = 'http://localhost:8080/' + this.transfers[index - 1].id
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