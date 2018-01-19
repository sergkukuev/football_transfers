import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import transfers from './containers/transfers'
import createTransfer from './containers/create_transfer'
import players from './containers/players'
import scouts from './containers/scouts'

// application routes
const routes = [
  { path: '/', component: transfers },
  { path: '/create', component: createTransfer },
  { path: '/players', component: players },
  { path: '/scouts', component: scouts }
]

// export router instance
export default new Router({
  mode: 'history',
  routes,
  linkActiveClass: 'is-active'
})
