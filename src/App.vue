<template>
  <div id="app">
    <admin msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import admin from './components/admin.vue'

export default {
  name: 'app',
  components: {
    admin
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



#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
