<template>
  <div id="app">
    <login v-if="!login"></login>
    <admin v-if="login" msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>

import { EventBus } from './bus.js'
import {setCookie, getCookie, clearCookie} from './utils.js'

import admin from './components/admin.vue'
import login from './components/login/index.vue'

export default {
  name: 'app',
  components: {
    admin,
    login
  },
  data(){
    return{
      login: false,
      username: "Admin"
    }
    
  },
  created() {
    var that = this

    if(getCookie('u_key') && getCookie('u_uuid')){
      this.login = true
    } else {
      this.username = getCookie('u_email')
    }

    EventBus.$on('login', function(data){
      that.login = true
    })

    EventBus.$on('logout', function(data){
      that.clearLoginCookie()
      that.login = false
    })

  },
  methods:{

    clearLoginCookie () {
        setCookie('u_key', 0, 30, true) // Set Key
        setCookie('u_uuid', 0, 30, true) // Set UUID
        setCookie('u_name', 0, 30, true) // Set UUID
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
