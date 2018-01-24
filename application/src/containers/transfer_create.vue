  <template lang="html">
  <div id="transfers">
    <p v-if="step !== 3"> Step {{step + 1}} of 3</p>
    <font v-if="step !== 3" size="5"> Create transfer: </font>
    <input type="hidden" id="selected" disabled>
    <div id="step1" v-if="step === 0">
      <font size="3"> Select a player: </font>
      <div id="waiting" v-if="statusPlayer === 0" class="notification"> 
        Loading... 
      </div>
      <div v-else-if="statusPlayer === 200">
        <div class="notification">
          Select a player who switches to another club: 
        </div>
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
          <button v-on:click="prev_players" style="margin-left:40%"> << </button>
          &nbsp Page {{page + 1}} &nbsp
          <button v-on:click="next_players"> >> </button>
        </div>
      </div>
      <div v-else class="notification">
        <font color="red"> {{error.message}} </font>
      </div>
    </div>
    <div id="step2" v-else-if="step === 1">
      <font size="3"> Select a scout: </font>
      <div v-if="statusScout === 0" class="notification"> 
        Loading... 
      </div>
      <div v-else-if="statusScout === 200">
        <div class="notification" v-if="step !== 2 && step !== 3">
          Select a dealer: 
        </div>
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
          <button v-on:click="prev_scouts" style="margin-left:40%"> << </button>
          &nbsp Page {{page + 1}} &nbsp
          <button v-on:click="next_scouts"> >> </button>
        </div>
      </div>
      <div v-else class="notification">
        <font color="red"> {{error.message}} </font>
      </div>
    </div>
    <div id="step3" v-else-if="step === 2">
      <font size="3"> Transfer information: </font>
      <div class="notification" style="background-color:grey">
        <div class="notification">
          <p> Player: </p>
          <div style="margin-left:40px">
            <ul style="list-style-type: disc">
              <li>ID: {{ player.id }}</li>
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
          </div>
          </br>
          <p>Scout</p>
          <div style="margin-left:40px">
            <ul style="list-style-type: disc">
              <li>ID: {{scout.id}}</li> 
              <li>Name: {{ scout.name }}</li>
              <li>Rank: {{ scout.rank }}</li>
              <li>Deals: {{ scout.amount.deals }}</li>
            </ul>
          </div>
        </div>
        <div class="notification">
          Enter the rest of the information about Transfer:
          <div>
            Buying club: </br>
            <input type="text" id="clubTo" v-model="$cookie.get('login')" style="margin-left:5%" readonly/> </br> </br>
            Transfer cost: </br>
            <input v-if="player.club !== 'NoClub'" type="text" id="cost" value="0" style="margin-left:5%"/>
            <input v-else type="text" id="cost" value="0" style="margin-left:5%" disabled/> </br> </br>
            Contract years: &nbsp
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
      <div class="notification" v-if="valid !== ''">
        <font color="red"> Ooooooops. {{valid}} </font>
      </div>
    </div>
    <div class="notification" v-else>
      <div v-if="status === 0" class="notification"> 
        Adding... 
      </div>
      <router-link v-else-if="status === 201 || status === 202" class="" to="/"> Transfer confirm </router-link>
      <font v-else color="red"> Ooooooops. Something went wrong </font>
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
      player: {},
      scout: {},
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
      statusPlayer: 0,
      statusScout: 0,
      status: 0,
      valid: '',
      error: {}
    }
  },
  methods: {
    post_transfer: function () {
      console.log(this.data)
      let path = '/transfers/create'
      const authorization = `Bearer ${this.$cookie.get('access_token')}`
      API.post(path, this.data, { headers: {authorization} }).then(response => {
        this.status = response.status
      }, (err) => {
        this.status = err.response.status
        this.error = err.response.data
        if (this.status === 401) {
          window.location = 'http://localhost:8080/login'
        }
      })
    },
    get_players: function () {
      let path = '/players?count=' + this.count + '&page=' + this.page
      API.get(path).then((response) => {
        if (response.data.content.length === 0) {
          --this.page
        } else {
          this.items = response.data.content
          this.statusPlayer = response.status
        }
      }, (err) => {
        this.error = err
        this.statusPlayer = err.response.status
        console.log(err)
      })
    },
    get_scouts: function () {
      let path = '/scouts?count=' + this.count + '&page=' + this.page
      const authorization = `Bearer ${this.$cookie.get('access_token')}`
      API.get(path, { headers: {authorization} }).then((response) => {
        if (response.data.content.length === 0) {
          --this.page
        } else {
          this.items = response.data.content
          this.statusScout = response.status
        }
      }, (err) => {
        this.error = err
        this.statusScout = err.response.status
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
      if (this.items.length === 0) {
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
      if (this.items.length === 0) {
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
      let index = document.getElementById('selected').value
      if (index !== '') {
        this.next_step()
      }
    },
    next_step: function () {
      if (this.step === 0) {
        let sel = document.getElementById('selected').value
        this.player = this.items[sel - 1]
        document.getElementById('selected').value = ''
        ++this.step
        this.page = 0
        this.get_scouts()
      } else if (this.step === 1) {
        let sel = document.getElementById('selected').value
        this.scout = this.items[sel - 1]
        ++this.step
      } else if (this.step === 2) {
        let cost = Number(parseInt(document.getElementById('cost').value))
        let club = document.getElementById('clubTo').value

        if (!club || typeof (club) === 'undefined') {
          this.valid = 'Field \'Buying club\' contains error'
        } else if (club.length === 0) {
          this.valid = 'Field \'Buying club\' contains error: empty string'
        } else if (club.length > 50) {
          this.valid = 'Field \'Buying club\' contains error: lenght must be smaller than 50'
        } else if (club === this.player.club) {
          this.valid = 'Field \'Buying club\' contains eror: Player already in this club'
        } else if (isNaN(cost) || cost < 0) {
          this.valid = 'Field \'Transfer cost\' contains error: cost must be greater than or equal 0'
        } else {
          this.valid = ''
          this.data.playerID = this.player.id
          this.data.scoutID = this.scout.id
          this.data.clubFrom = this.player.club
          this.data.cost = cost
          this.data.clubTo = club
          this.post_transfer()
          this.step++
        }
      }
    }
  },
  mounted: function () {
    let token = this.$cookie.get('access_token')
    console.log(token)
    if (token.length === 0 || typeof (token) === 'undefined') {
      window.location = 'http://localhost:8080/login'
    } else {
      this.get_players()
    }
  }
}
</script>

<style lang="css">
  table th {background-color: lightblue;}
</style>