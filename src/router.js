import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import home from './components/home'
import postslist from './components/postslist'
import postsingle from './components/postsingle'
import cateslist from './components/cateslist'
import catesingle from './components/catesingle'
import fileslist from './components/fileslist'
import visitorlist from './components/visitorlist'
import visitTest from './components/visittest'
import settings from './components/settings'
import adminsettings from './components/adminsettings'
import socialmedialist from './components/socialmedialist'
import socialmediasingle from './components/socialmediasingle'



export default new VueRouter({
  routes: [
      { path:'/', name:'Home', redirect: '/home' },
      { path: '/home', name: 'home', component: home },
      { path: '/postslist', name: 'postslist', component: postslist },
      { path: '/postsingle', name: 'postsingle', component: postsingle },
      { path: '/cateslist', name: 'cateslist', component: cateslist },
      { path: '/catesingle', name: 'catesingle', component: catesingle },
      { path: '/fileslist', name: 'fileslist', component: fileslist },
      { path: '/visitorlist', name: 'visitorlist', component: visitorlist },
      { path: '/visittest', name: 'visittest', component: visitTest },
      { path: '/settings', name: 'settings', component: settings },
      { path: '/adminsettings', name: 'adminsettings', component: adminsettings },
      { path: '/socialmedialist', name: 'socialmedialist', component: socialmedialist },
      { path: '/socialmediasingle', name: 'socialmediasingle', component: socialmediasingle }
    ]
})