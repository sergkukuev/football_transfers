<template lang="html">
  <div id="player">
    <font size="5"> Player information: </font>
    ({{ id = $route.params.id }})
    <div id="waiting" class="notification" v-if="status === 0">
      Loading...
    </div>
    <div id="exist" class="notification" v-else-if="status === 200">
      <ul style="list-style-type: disc">
        <li>ID: {{ id = $route.params.id }}</li>
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
      <router-link class="" to="/"> Back </router-link> 
    </div>
    <div class="notification" id="notexist" v-else>
      <font color="red"> Oooooops. {{error.message}} </font>
    </div>
  </div>
</template>

<script>
  import {API} from './api'

export default {
    name: 'player',
    data: function () {
      return {
        id: '',
        player: {},
        status: 0,
        error: {}
      }
    },
    methods: {
      get_player: function () {
        let path = '/players/' + this.id
        API.get(path).then((response) => {
          this.player = response.data
          this.status = response.status
        }, (err) => {
          this.error = err.response.data
          this.status = err.response.status
          console.log(this.error)
        })
      },
      isJson: function (item) {
        item = typeof item !== 'string' ? JSON.stringify(item) : item
        try {
          item = JSON.parse(item)
        } catch (e) {
          return false
        }
        if (typeof item === 'object' && item !== null) {
          return true
        }
        return false
      }
    },
    mounted: function () {
      this.get_player()
    }
  }
</script>

<style lang="css">
</style>