import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import home from './containers/home'
import transfers from './containers/transfers'
import players from './containers/players'
import scouts from './containers/scouts'

// application routes
const routes = [
  { path: '/', component: home },
  { path: '/transfers', component: transfers },
  { path: '/players', component: players },
  { path: '/scouts', component: scouts }
]

// export router instance
export default new Router({
  mode: 'history',
  routes,
  linkActiveClass: 'is-active'
})
