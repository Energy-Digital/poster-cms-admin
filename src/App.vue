<template>
  <div id="app">
    <setup v-if="setupShow" :base="base"></setup>
    <login v-if="loginShow" :base="base"></login>
    <admin v-if="adminShow" :base="base"/>
  </div>
</template>

<script>

import { EventBus } from './bus.js'
import {setCookie, getCookie} from './utils.js'

import admin from './components/admin'
import login from './components/login/index'
import setup from './components/setup/index'

export default {
  name: 'app',
  components: {
    setup,
    login,
    admin
  },
  data(){
    return{
      loginShow: false,
      setupShow: false,
      adminShow: false,
      username: "Admin",
      base: "https://isjeff.com/api"
    }
    
  },
  created() {
    var that = this

    if(getCookie('u_key') && getCookie('u_uuid')){
      that.setupShow = false
      that.loginShow = false
      that.adminShow = true
    } else {
      this.username = getCookie('u_email')
      that.loginShow = true
    }

    EventBus.$on('setup', function(data){
      that.clearLoginCookie()
      that.setupShow = true
      that.loginShow = false
      that.adminShow = false
    })

    EventBus.$on('setup-done', function(data){
      that.setupShow = false
      that.loginShow = true
      that.adminShow = false
    })

    EventBus.$on('login', function(data){
      that.setupShow = false
      that.loginShow = false 
      that.adminShow = true
    })

    EventBus.$on('logout', function(data){
      that.clearLoginCookie()
      that.setupShow = false
      that.loginShow = true
      that.adminShow = false
    })

    EventBus.$on('force-logout', function(data){
      that.clearLoginCookie()
      that.setupShow = false
      that.loginShow = true
      that.adminShow = false
      that.$notify({
          title: "You've been force logout",
          message: "you are using other device or somebody logged in your account.",
          type: 'warning'
      })
    })

  },
  methods:{

    clearLoginCookie () {
      setCookie('u_key', 0, 30, true) // Set Key
      setCookie('u_uuid', 0, 30, true) // Set UUID
      setCookie('u_name', 0, 30, true) // Set UUID
      setCookie('u_avatar', 0, 30, true) // Set UUID
    }
    
  }
}
</script>

<style>

html{
  margin:0;
  padding:0;
}

body{
  margin:0;
  padding:0;
}

textarea:focus, input:focus{
    outline: none;
}

a{
  text-decoration: none;
  outline: none;
}

[contenteditable]:focus {
    outline: 0px solid transparent;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
