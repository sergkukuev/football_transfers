import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import transfers from './containers/transfers'
import createTransfer from './containers/transfer_create'
import infoTransfer from './containers/transfer_info'
import players from './containers/players'
import infoPlayer from './containers/player_info'
import updatePlayer from './containers/player_update'
import scouts from './containers/scouts'

// application routes
const routes = [
  { path: '/', component: transfers },
  { path: '/create', component: createTransfer },
  { path: '/players', component: players },
  { path: '/scouts', component: scouts },
  { path: '/players/:id', component: infoPlayer },
  { path: '/players/:id/contract', component: updatePlayer },
  { path: '/:id', component: infoTransfer }
]

// export router instance
export default new Router({
  mode: 'history',
  routes,
  linkActiveClass: 'is-active'
})
