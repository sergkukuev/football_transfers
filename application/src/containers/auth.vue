  <template lang="html">
  <div id="auth">
  	<font size="5"> Authorization please: </font>
    <div class="notification">
      <div>
        Login:
        <input type="text" id="login" value="Arsenal" style="margin-left:40px"/> </br> </br>
        Password:
        <input type="text" id="password" value="1111" style="margin-left:16px"/>
      </div>
      </br>
      <button v-on:click="auth"> Login </button>
	  <button v-on:click="oauth2" style="margin-right:10%"> Oauth2 login </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'transfers',
  data: function () {
    return {
    }
  },
  methods: {
    auth: function () {
      console.log('auth')
    },
    oauth2: function () {
      console.log('oauth2')
    }
  }
}
</script>

<style lang="css">
</style>