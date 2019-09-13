import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import home from './components/home'
import postslist from './components/postslist'
import postsingle from './components/postsingle'
import cateslist from './components/cateslist'
import catesingle from './components/catesingle'


export default new VueRouter({
  routes: [
      { path:'/', name:'Home', redirect: '/home' },
      { path: '/home', name: 'home', component: home },
      { path: '/postslist', name: 'postslist', component: postslist },
      { path: '/postsingle', name: 'postsingle', component: postsingle },
      { path: '/cateslist', name: 'cateslist', component: cateslist },
      { path: '/catesingle', name: 'catesingle', component: catesingle },
    ]
})