<template lang="html">
  <div id="players">
    <div class="notification">
      Number of players per page: &nbsp
      <input type="text" v-model="count" v-bind:class="count" v-on:change="get_players" style="width:40px"/>
    </div>
    <div class="columns">
      <div class="table">
        <table class="table">
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
  name: 'players',
  data: function () {
    return {
      page: 0,
      count: 10,
      players: [],
      error: ''
    }
  },
  methods: {
    get_players: function () {
      let path = 'http://127.0.0.1:3000/players?count=' + this.count + '&page=' + this.page
      axios.get(path).then((response) => {
        this.players = response.data
      }, (err) => {
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
    }
  },
  mounted: function () {
    this.get_players()
  }
}
</script>

<style lang="css">
</style>
