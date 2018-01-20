<template lang="html">
  <div id="transfer">
    <ul>
      <li>Transfer ID: {{ id = $route.params.id }}</li>
      <li v-if="transfer.Player === 'undefined' || !isJson(transfer.Player)">Player: {{ transfer.Player }}</li>
      <div v-else>
        <li>Player:</li>
        <ul>
          <li>Name: {{ transfer.Player.Name }}</li>
          <li>Club: {{ transfer.Player.Club }}</li>
          <li>Age: {{ transfer.Player.Age }}</li>
          <li>Rating: {{ transfer.Player.Rating }}</li>
          <li>Contract:</li>
          <ul>
            <li>Start date: {{ transfer.DateOfSign }}</li>
            <li>Years: {{ transfer.Player.Contract.Years }}</li>
          </ul>
        </ul>
      </div>
      <li v-if="transfer.Scout === 'undefined' || !isJson(transfer.Scout)">Scout: {{ transfer.Scout }}</li>
      <div v-else>
        <li>Scout: </li>
        <ul>
          <li>Name: {{ transfer.Scout.Name }}</li>
          <li>Rank: {{ transfer.Scout.Rank }}</li>
          <li>Deals: {{ transfer.Scout.Deals }}</li>
          <li>Contracts: {{ transfer.Scout.Contracts }}</li>
        </ul>
      </div>
      <li>Cost: {{ transfer.Cost }}</li>
      <li>Date of sign: {{ transfer.DateOfSign }}</li>
      <li>Club:</li>
      <ul>
        <li>To: {{ transfer.Club.To }}</li>
        <li>From: {{ transfer.Club.From }}</li>
      </ul> 
    </ul>
    </br>
    <router-link class="" to="/"> Back </router-link> </br>
  </div>
</template>

<script>
  import {API} from './api'

export default {
    name: 'transfer',
    data: function () {
      return {
        id: '',
        transfer: {},
        status: 0,
        error: {}
      }
    },
    methods: {
      get_transfer: function () {
        let path = '/transfers/' + this.id
        API.get(path).then((response) => {
          console.log(response.data)
          this.transfer = response.data
          this.status = response.status
        }, (err) => {
          this.error = err
          this.status = err.response.status
          console.log(err)
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
      this.get_transfer()
    }
  }
</script>

<style lang="css">
</style>