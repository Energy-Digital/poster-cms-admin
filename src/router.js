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
import visittest from './components/visittest'
import visittestadm from './components/visittestadm'
import settings from './components/settings'
import adminsettings from './components/adminsettings'
import socialmedialist from './components/socialmedialist'
import socialmediasingle from './components/socialmediasingle'
import navslist from './components/navslist'
import navsingle from './components/navsingle'
import themeslist from './components/themeslist'
import themesettings from './components/themesettings'


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
      { path: '/visittest', name: 'visittest', component: visittest },
      { path: '/visittestadm', name: 'visittestadm', component: visittestadm },
      { path: '/settings', name: 'settings', component: settings },
      { path: '/adminsettings', name: 'adminsettings', component: adminsettings },
      { path: '/socialmedialist', name: 'socialmedialist', component: socialmedialist },
      { path: '/socialmediasingle', name: 'socialmediasingle', component: socialmediasingle },
      { path: '/navslist', name: 'navslist', component: navslist },
      { path: '/navsingle', name: 'navsingle', component: navsingle },
      { path: '/themeslist', name: 'themeslist', component: themeslist },
      { path: '/themesettings', name: 'themesettings', component: themesettings },
    ]
})
