<template lang="html">
  <div id="transfers">
    <p v-if="step !== 3"> Step {{step + 1}} of 3</p>
    <div class="notification" v-if="step !== 2 && step !== 3">
        Select one from the table: </br>
        Selected: &nbsp
        <input type="text" id="selected" value="-" style="width:40px" disabled>
    </div>
    <div id="step1" v-if="step === 0">
      Players: </br>
      <div class="table">
        <table id="players" class="table" v-on:click="get_row('players')">
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
            <tr v-for="item in items">
              <td>{{item.name}}</td>
              <td>{{item.club}}</td>
              <td>{{item.rating}}</td>
              <td>{{item.contract.date}}</td>
              <td>{{item.contract.years}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="notification">
        <div class="">
          <button v-on:click="prev_players" style="margin-left:40%"> << </button>
          &nbsp Page {{page + 1}} &nbsp
          <button v-on:click="next_players"> >> </button>
          <button v-on:click="next_step" style="margin-right:10%"> Next step </button>
        </div>
      </div>
    </div>
    <div id="step2" v-else-if="step === 1">
      Scouts: </br>
      <div class="table">
        <table id="scouts" class="table" v-on:click="get_row('scouts')">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rank</th>
              <th>Amount of Deals</th>
              <th>Amount of Contracts</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items">
              <td>{{item.name}}</td>
              <td>{{item.rank}}</td>
              <td>{{item.amount.deals}}</td>
              <td>{{item.amount.contracts}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="notification">
        <div class="">
          <button v-on:click="prev_scouts" style="margin-left:40%"> << </button>
          &nbsp Page {{page + 1}} &nbsp
          <button v-on:click="next_scouts"> >> </button>
          <button v-on:click="next_step" style="margin-right:10%"> Next step </button>
        </div>
      </div>
    </div>
    <div id="step3" v-else-if="step === 2">
      <div class="notification">
        Enter the rest of the information about Transfer:
        <div>
          Buying club: </br>
          <input type="text" id="clubTo" value="NoClub" style="margin-left:5%"/> </br> </br>
          Transfer cost: </br>
          <input type="text" id="cost" value="0" style="margin-left:5%"/> </br> </br>
          Contract years: </br>
          <select v-model="data.years">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </select>
        </div>
      </div>
      <button v-on:click="next_step" style="margin-right:10%"> Create </button>
    </div>
    <div v-else>
      <router-link class="" to="/"> Done </router-link>
    </div>
  </div>
</template>

<script>
import {API} from './api'

export default {
  name: 'transfers',
  data: function () {
    return {
      items: [],
      data: {
        playerID: '',
        scoutID: '',
        date: '21.01.2018',
        clubTo: '',
        clubFrom: '',
        years: 1
      },
      page: 0,
      count: 10,
      step: 0,
      status: 200,
      error: {}
    }
  },
  methods: {
    post_transfer: function () {
      console.log(this.data)
      let path = '/transfers/create'
      API.post(path, this.data).then(response => {
        console.log(response)
      }, (err) => {
        console.log(err)
      })
    },
    get_players: function () {
      let path = '/players?count=' + this.count + '&page=' + this.page
      API.get(path).then((response) => {
        if (response.data.length === 0) {
          --this.page
        } else {
          this.items = response.data
          this.status = response
        }
      }, (err) => {
        this.error = err
        this.status = err.response.status
        console.log(err)
      })
    },
    get_scouts: function () {
      let path = '/scouts?count=' + this.count + '&page=' + this.page
      API.get(path).then((response) => {
        if (response.data.length === 0) {
          --this.page
        } else {
          this.items = response.data
          this.status = response.status
        }
      }, (err) => {
        this.error = err
        this.status = err.response.status
        console.log(err)
      })
    },
    prev_players: function () {
      if (this.page > 0) {
        --this.page
        this.get_players()
      }
    },
    next_players: function () {
      ++this.page
      this.get_players()
      if (this.players.length === 0) {
        this.prev_page()
      }
    },
    prev_scouts: function () {
      if (this.page > 0) {
        --this.page
        this.get_scouts()
      }
    },
    next_scouts: function () {
      ++this.page
      this.get_scouts()
      if (this.scouts.length === 0) {
        this.prev_scouts()
      }
    },
    get_row: function (name) {
      let table = document.getElementById(name)
      for (let i = 0; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
          document.getElementById('selected').value = this.rowIndex
        }
      }
    },
    next_step: function () {
      if (this.step === 0) {
        let sel = document.getElementById('selected').value
        if (sel !== '-') {
          this.data.playerID = this.items[sel - 1].id
          this.data.clubFrom = this.items[sel - 1].club
          document.getElementById('selected').value = '-'
          ++this.step
          this.get_scouts()
        }
      } else if (this.step === 1) {
        let sel = document.getElementById('selected').value
        if (sel !== '-') {
          ++this.step
          this.data.scoutID = this.items[sel - 1].id
        }
      } else if (this.step === 2) {
        let cost = Number(parseInt(document.getElementById('cost').value))
        let club = document.getElementById('clubTo').value

        if (!club || typeof (club) === 'undefined' || club.length === 0 || club.length > 50) {
          console.log('club err')
        } else if (isNaN(cost) || cost < 0) {
          console.log('cost err')
        } else {
          this.data.cost = cost
          this.data.clubTo = club
          this.post_transfer()
          ++this.step
        }
      }
      this.page = 0
    }
  },
  mounted: function () {
    this.get_players()
  }
}
</script>

<style lang="css">
  table th {background-color: lightblue;}
</style>