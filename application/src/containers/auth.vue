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
        login: 'Yupiter',
        password: '8888'
      }
    }
  },
  methods: {
    auth: function () {
      let path = '/auth'
      API.post(path, this.data).then(response => {
        console.log(response.data)
      }, (err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="css">
</style>