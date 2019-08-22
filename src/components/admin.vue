<template>
  <div class="all">
    <login></login>
    <!--div id="header-cont">
      <topping></topping>
    </div>
    
    <div id="left-cont">
      <sidebar></sidebar>
    </div>
    
    <div id="right-cont">

    </div-->
    
  </div>
</template>

<script>

import login from './login.vue'
import topping from './topping.vue'
import sidebar from "./sidebar.vue"

export default {
  name: 'admin',
  components:{
    login,
    topping,
    sidebar
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#header-cont{
  height:80px;
  width:100%;
  position: absolute;
  top:0px;
}

#left-cont{
  position: absolute;
  top: 80px;
  left: 0px;
  height:100%;
  width:32%;
}

#right-cont{
  position:absolute;
  top:80px;
  right:0px;
  height:100%;
  width:68%;
}
</style>
