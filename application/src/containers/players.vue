<template lang="html">
  <div id="players" v-if="status === 200">
    <input type="hidden" id="selected" value="-" style="width:40px" disabled>
    <div class="notification">
      Number of players per page: &nbsp
      <input type="text" v-model="count" v-bind:class="count" v-on:change="update_count" style="width:40px"/>
    </div>
    <table id="play" v-on:click="get_info('play')" class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Club</th>
          <th>Rating</th>
          <th>Contract: Start date</th>
          <th>Contract: Years</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in players">
          <td>{{item.name}}</td>
          <td>{{item.club}}</td>
          <td>{{item.rating}}</td>
          <td>{{item.contract.date}}</td>
          <td>{{item.contract.years}}</td>
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
    <label style="margin-left:40%"> {{error.message}} : {{error.response.statusText}} </label>
  </div>
</template>

<script>
import {API} from './api'

export default {
  name: 'players',
  data: function () {
    return {
      page: 0,
      count: 10,
      players: [],
      status: 200,
      error: {}
    }
  },
  methods: {
    get_players: function () {
      let path = '/players?count=' + this.count + '&page=' + this.page
      API.get(path).then((response) => {
        if (response.data.length === 0) {
          --this.page
        } else {
          console.log(response.data)
          this.players = response.data
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
        this.get_players()
      }
    },
    next_page: function () {
      ++this.page
      this.get_players()
      if (this.players.length === 0) {
        this.prev_page()
      }
    },
    update_count: function () {
      this.page = 0
      this.get_players()
    },
    get_info: function (name) {
      let table = document.getElementById(name)
      for (let i = 0; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
          document.getElementById('selected').value = this.rowIndex
        }
      }
      let index = document.getElementById('selected').value
      window.location = 'http://localhost:8080/players/' + this.players[index - 1].id
    }
  },
  mounted: function () {
    this.get_players()
  }
}
</script>

<style lang="css">
</style>