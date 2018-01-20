<template lang="html">
  <div id="transfer">
    <font size="5"> Transfer information: </font>
    ({{ id = $route.params.id }})
    <div id="waiting" class="notification" v-if="status === 0">
      Loading...
    </div>
    <div id="exist" class="notification" v-else-if="status === 200">
      <ul style="list-style-type: disc">
        <li>Transfer ID: {{ id = $route.params.id }}</li>
        <li v-if="transfer.Player === 'undefined' || !isJson(transfer.Player)">Player: {{ transfer.Player }}</li>
        <div v-else>
          <li>Player:
            <ul>
              <li> &nbsp Name: {{ transfer.Player.Name }}</li>
              <li> &nbsp Club: {{ transfer.Player.Club }}</li>
              <li> &nbsp Age: {{ transfer.Player.Age }}</li>
              <li> &nbsp Rating: {{ transfer.Player.Rating }}</li>
              <li> &nbsp Contract:
                <ul>
                  <li> &nbsp &nbsp Start date: {{ transfer.DateOfSign }}</li>
                  <li> &nbsp &nbsp Years: {{ transfer.Player.Contract.Years }}</li>
                </ul>
              </li>
            </ul>
          </li>
        </div>
        <li v-if="transfer.Scout === 'undefined' || !isJson(transfer.Scout)">Scout: {{ transfer.Scout }}</li>
        <div v-else>
          <li>Scout: 
            <ul>
              <li> &nbsp Name: {{ transfer.Scout.Name }}</li>
              <li> &nbsp Rank: {{ transfer.Scout.Rank }}</li>
              <li> &nbsp Deals: {{ transfer.Scout.Deals }}</li>
              <li> &nbsp Contracts: {{ transfer.Scout.Contracts }}</li>
            </ul>
          </li>
        </div>
        <li>Cost: {{ transfer.Cost }}</li>
        <li>Date of sign: {{ transfer.DateOfSign }}</li>
        <li>Club:
          <ul>
            <li>To: {{ transfer.Club.To }}</li>
            <li>From: {{ transfer.Club.From }}</li>
          </ul>
        </li>
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
          this.transfer = response.data
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
      this.get_transfer()
    }
  }
</script>

<style lang="css">
</style>