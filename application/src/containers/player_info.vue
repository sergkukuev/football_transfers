<template lang="html">
  <div id="player">
    <ul>
      <li>Player ID: {{ id = $route.params.id }}</li>
      <li>Name: {{ player.name }}</li>
      <li>Club: {{ player.club }}</li>
      <li>Age: {{ player.age }}</li>
      <li>Rating: {{ player.rating }}</li>
      <li>Contract:</li>
      <ul>
        <li>Start date: {{ player.contract.date }}</li>
        <li>Years: {{ player.contract.years }}</li>
      </ul>
    </ul>
    </br>
    <router-link class="" to="/players"> Back </router-link> </br>
  </div>
</template>

<script>
  import {API} from './api'

export default {
    name: 'player',
    data: function () {
      return {
        id: '',
        page: 0,
        count: 10,
        player: {},
        status: 200,
        error: {}
      }
    },
    methods: {
      get_player: function () {
        let path = '/players/' + this.id
        API.get(path).then((response) => {
          this.player = response.data
          console.log(this.player)
          this.status = response.status
        }, (err) => {
          this.error = err
          this.status = err.response.status
          console.log(err)
        })
      }
    },
    mounted: function () {
      this.get_player()
    }
  }
</script>

<style lang="css">
</style>