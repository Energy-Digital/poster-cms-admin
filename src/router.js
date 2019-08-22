import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import home from './components/home'
import login from './components/login'
import postslist from './components/postslist'
import postsingle from './components/postsingle'


export default new VueRouter({
  routes: [
      { path:'/', name:'Home', redirect: '/home' },
      { path: '/home', name: 'home', component: home },
      { path: '/postslist', name: 'postslist', component: postslist },
      { path: '/postsingle', name: 'postsingle', component: postsingle },
      { path: '/login', name: 'login', component: login }
    ]
})