<template lang="html">
  <div id="transfers">
    <div class="columns">
      <div class="column is-half">
        <div class="notification">
          List of all available transfers
        </div>
        <div class="">
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'transfers',
  data: function () {
    return {
      transfers: []
    }
  },
  methods: {
    getTransfers: function () {
      axios.get('http://localhost:3000/transfers').then((response) => {
        this.transfers = response
      }, (err) => {
        console.log(err)
      })
    }
  },
  mounted: function () {
    this.getTransfers()
  }
}
</script>

<style lang="css">
</style>
