<template lang="html">
  <nav class="nav has-shadow" >
    <div class="nav-left">
      <router-link class="nav-item is-brand" to="/">
        Transfers
      </router-link>
      <router-link class="nav-item is-tab" to="/create">
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
      <!-- Wiil be login and logout
      <span class="nav-item">
        <a class="button">Logout</a>
      </span> -->
    </div>
  </nav>
</template>

<script>
export default {
  name: 'navbar'
}
</script>

<style lang="css">

</style>
