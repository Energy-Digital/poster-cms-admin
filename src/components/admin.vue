<template>
  <div class="all">

    <div id="header-cont">
      <topping :siteName="siteName"></topping>
    </div>
    
    <div id="left-cont">
      <sidebar></sidebar>
    </div>
    
    <div id="right-cont">
      <router-view 
        v-if="loaded"
        ref="rot"
        :base="base">
      </router-view>
    </div>
    
  </div>
</template>

<script>

import { EventBus } from '../bus'
import { genGet } from '../request'
import { decodeRichText } from '../utils'
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
      base: "",
      api: "https://api.isjeff.com/pot/data/basic/",
      siteName: "",
      loaded: false,
    }
  },
  created(){
    var that = this
    this.getData()
    EventBus.$on("toPage", function(data){
      that.toPage(data)
    })
    
  },
  methods: {

    getData () {
      var that = this
      genGet(this.api, [], (res)=>{
        if(res.status){
          that.base = res.data[0].baseUrl
          that.siteName = decodeRichText(res.data[0].title)
          that.loaded = true
        } else {
          var newApiBase = prompt("Can not establish basic connection, you might just change your base url:", "")
          that.api = newApiBase + "/data/basic/"
          that.getData()
        }
      })
    },

    checkCookies () {
      //console.log(document.cookie)
    },

    toPage (dir) {
      this.$router.push({ path: dir })
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
  height:40px;
  width:100%;
  position: fixed;
  top:0px;
  z-index:999;
}

#left-cont{
  position: fixed;
  top: 0px;
  left: 0px;
  height:100%;
  width:15%;
  overflow: hidden;
}

#right-cont{
  position:absolute;
  top:40px;
  right:0px;
  height:100%;
  width:85%;
}
</style>
