<template lang="html">
  <nav class="nav has-shadow" >
    <div class="nav-left">
      <router-link class="nav-item is-brand" to="/">
        Transfers
      </router-link>
      <router-link class="nav-item" to="/create">
        <i class="fa fa-list-alt"></i> New transfer
      </router-link>
      <router-link class="nav-item is-tab" to="/players">
        <i class="fa fa-list-alt"></i> Players
      </router-link>
      <router-link class="nav-item is-tab" to="/scouts">
        <i class="fa fa-list-alt"></i> Scouts
      </router-link>
    </div>
    <div class="nav-right">
      <div v-if="typeof($cookie.get('login')) === 'undefined' || $cookie.get('login') === 'NoClub'">
        <span class="nav-item">
          <font> NoClub (not authorized)</font> &nbsp
          <a class="button" v-on:click="login">Login</a>
        </span>
      </div>
      <div v-else>
        <span class="nav-item">
          <font>{{$cookie.get('login')}}</font> &nbsp
          <a class="button" v-on:click="logout">Logout</a>
        </span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navbar',
  methods: {
    login: function () {
      window.location = 'http://localhost:8080/login'
    },
    logout: function () {
      this.$cookie.set('login', 'NoClub')
      this.$cookie.set('access_token', '')
      window.location.reload()
    }
  }
}
</script>

<style lang="css">

</style>
