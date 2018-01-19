<template lang="html">
  <div id="players">
    <div class="columns">
      <div class="column is-half">
        <div class="notification">
          List of all available players
        </div>
        <div class="">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Club</th>
                <th>Rating</th>
                <th>ContractDate</th>
                <th>ContractYears</th>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'players',
  data: function () {
    return {
      players: []
    }
  },
  methods: {
    getPlayers: function () {
      axios.get('http://localhost:3000/players').then((response) => {
        this.players = response
      }, (err) => {
        console.log(err)
      })
    }
  },
  mounted: function () {
    this.getPlayers()
  }
}
</script>

<style lang="css">
</style>
