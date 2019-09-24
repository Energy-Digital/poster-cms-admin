<template>
  <div class="all">

    <div id="header-cont">
      <topping :siteName="siteName"></topping>
    </div>
    
    <div id="left-cont">
      <sidebar></sidebar>
    </div>
    
    <div id="right-cont">
      <router-view :pid.sync="pid" :cateId.sync="cateId" :smId.sync="smId"></router-view>
    </div>
    
  </div>
</template>

<script>

import { EventBus } from '../bus'
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
      pid: "1",
      cateId: "",
      smId: "",
      api: "https://api.isjeff.com/pot/data/basic/",
      siteName: ""
    }
  },
  created(){
    var that = this
    this.getData()
    EventBus.$on("toPage", function(data){
      that.toPage(data)
    })

    EventBus.$on('toPostSingle', function(data){
      that.toPostSingle(data)
    })

    EventBus.$on('toCateSingle', function(data){
      that.toCateSingle(data)
    })

    EventBus.$on('toSMSingle', function(data){
      that.toSMSingle(data)
    })
    
  },
  methods: {

    getData () {
      var that = this
      this.axios.get(this.api).then((response) => {
        console.log(response.data)
        that.siteName = decodeRichText(response.data[0].title)
      })
    },

    checkCookies () {
      //console.log(document.cookie)
    },

    toPage (dir) {
      this.$router.push({ path: dir })
    },

    toPostSingle (id) {
      this.pid = id
      this.$router.push({ path: '/postsingle' })
    },

    toCateSingle (id) {
      this.cateId = id
      this.$router.push( { path: '/catesingle' } )
    },

    toSMSingle (id) {
      this.smId = id
      this.$router.push( { path: '/socialmediasingle' } )
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
  top: 40px;
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
