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
      <span class="nav-item">
        <a class="button" v-on:click="get_auth">Login</a>
      </span>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navbar',
  methods: {
    get_auth: function () {
      window.location = 'http://localhost:8080/login'
    }
  }
}
</script>

<style lang="css">

</style>
