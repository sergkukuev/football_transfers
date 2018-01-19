<template lang="html">
  <div id="scouts">
    <div class="columns">
      <div class="column is-half">
        <div class="notification">
          List of all available scouts
        </div>
        <div class="">
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
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'scouts',
  data: function () {
    return {
      scouts: []
    }
  },
  methods: {
    getScouts: function () {
      axios.get('http://localhost:3000/scouts').then((response) => {
        this.scouts = response
      }, (err) => {
        console.log(err)
      })
    }
  },
  mounted: function () {
    this.getScouts()
  }
}
</script>

<style lang="css">
</style>
