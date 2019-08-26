<template>
  <div class="all">

    <div id="header-cont">
      <topping></topping>
    </div>
    
    <div id="left-cont">
      <sidebar></sidebar>
    </div>
    
    <div id="right-cont">
      <router-view :pid.sync="pid"></router-view>
    </div>
    
  </div>
</template>

<script>

import { EventBus } from '../bus.js'
import topping from './topping.vue'
import sidebar from "./sidebar.vue"

export default {
  name: 'admin',
  components:{
    topping,
    sidebar
  },
  props: {
    username: String
  },
  data(){
    return{
      user:"Admin",
      pid: "1",
    }
  },
  created(){
    var that = this
    EventBus.$on("toPage", function(data){
      that.toPage(data)
    })

    EventBus.$on('toPostSingle', function(data){
      that.toPostSingle(data)
    })
    
  },
  methods: {
    checkCookies () {
      console.log(document.cookie)
    },

    toPage (dir) {
      this.$router.push({ path: dir })
    },

    toPostSingle (id) {
      this.pid = id
      this.$router.push({ path: '/postsingle' })
    }

    
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
  width:20%;
  overflow: hidden;
}

#right-cont{
  position:absolute;
  top:80px;
  right:0px;
  height:100%;
  width:80%;
}
</style>
