<template>
  <div id="app">
    <login v-if="!login"></login>
    <admin v-if="login" msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import { EventBus } from './bus.js'
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
      username: "Admin",
    }
    
  },
  created() {
    var that = this

    if(this.getCookie('u_key') && this.getCookie('u_uuid')){
      this.login = true
    } else {
      this.username = this.getCookie('u_email')
    }

    EventBus.$on('login', function(data){
      that.login = true
      
    })

    EventBus.$on('logout', function(data){
      that.clearCookie()
      that.login = false
    })

    EventBus.$on('setCookie', function(data){
      that.setCookie(data.name, data.value, data.expDays, data.remove)
    })

    EventBus.$on('clearCookie', function(data){
      that.clearCookie()
    })

  },
  methods:{
    getCookie(cname){
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) 
      {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
      }
      return "";
    },

    setCookie (name, value, expDays, remove) {
        var exp, expTime
        
        if(!remove){
            expTime = (((60 * 1000)*60)*24)*expDays // 30 days
            exp = new Date()
            exp.setTime(exp.getTime() + expTime)
            document.cookie = name + "=" + value + ";" + "expires=" + exp.toGMTString()+";"
        } else {
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        }
        
    },

    clearCookie () {
        this.setCookie('u_key', 0, 30, true) // Set Key
        this.setCookie('u_uuid', 0, 30, true) // Set UUID
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

[contenteditable]:focus {
    outline: 0px solid transparent;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
