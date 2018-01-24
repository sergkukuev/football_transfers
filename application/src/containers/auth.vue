  <template lang="html">
  <div id="auth">
  	<font size="5"> Authorization please: </font>
    <div class="notification">
      <div>
        Login:
        <input type="text" id="login" v-model="data.login" style="margin-left:40px"/> </br> </br>
        Password:
        <input type="text" id="password" v-model="data.password" style="margin-left:16px"/>
      </div>
  	  </br>
      <a v-bind:href="oauth2"> OAuth2 authorization </a>
      </br> </br>
      <button v-on:click="auth"> Login </button>
    </div>
    <div class="notification" v-if="status !== 200">
    	<font color="red"> {{error}} </font>
    </div>
  </div>
</template>

<script>
import {API} from './api'

export default {
  name: 'transfers',
  data: function () {
    return {
      oauth2: 'http://127.0.0.1:3000/api/oauth2',
      data: {
        login: 'Arsenal',
        password: '1111'
      },
      status: 0,
      error: ''
    }
  },
  methods: {
    auth: function () {
      let path = '/auth'
      API.post(path, this.data).then(response => {
        this.status = response.data.status
        if (this.status === 200) {
          console.log(response.data)
          this.$cookie.set('login', this.data.login)
          this.$cookie.set('access_token', response.data.content.access_token)
          window.location = 'http://localhost:8080/'
        } else {
          this.error = response.data.message
        }
      }, (err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="css">
</style>