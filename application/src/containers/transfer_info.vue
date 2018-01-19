<template lang="html">
  <div id="transfer">
    <ul>
      <li>Transfer ID: {{ id = $route.params.id }}</li>
      <li>Player: {{ transfer.Player }}</li>
      <ul>
        <li>Name: {{ transfer.Player.Name }}</li>
        <li>Club: {{ transfer.Player.Club }}</li>
        <li>Age: {{ transfer.Player.Age }}</li>
        <li>Rating: {{ transfer.Player.Rating }}</li>
        <li>Contract:</li>
        <ul>
          <li>Start date: {{ transfer.Player.Contract.Date }}</li>
          <li>Years: {{ transfer.Player.Contract.Years }}</li>
        </ul>
      </ul>
      <li>Scout: {{ transfer.Scout }} </li>
      <ul>
        <li>Name: {{ transfer.Scout.Name }}</li>
        <li>Rank: {{ transfer.Scout.Rank }}</li>
        <li>Deals: {{ transfer.Scout.Deals }}</li>
        <li>Contracts: {{ transfer.Scout.Contracts }}</li>
      </ul>
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
        page: 0,
        count: 10,
        transfer: {},
        status: 200,
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
      }
    },
    mounted: function () {
      this.get_transfer()
    }
  }
</script>

<style lang="css">
</style>