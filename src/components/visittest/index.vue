<template>
  <div id="all">

    <WTitle txt="Your visit has marked"></WTitle>

  </div>
</template>

<script>
import WTitle from '../widgets/w_title.vue'
import { logVisit } from '../../request.js'

export default {
  name: "visittest",
  components:{
    WTitle
  },
  props:{
    base: String
  },
  data(){
    return{
      api_ip: "/data/getip/",
      api_getIpInfo: "http://api.ipstack.com/",
      api_key: "?access_key=4a0d7c9b3e1b25a888b23bea248723dd",
      api_up: "/updater/visit/",
      userInfoRes: {},
    }
  },
  http: {
    emulateJSON: true,
    emulateHTTP: true
  },
  created(){

    setTimeout(()=>{
        this.getIp()
    }, 500)
     
  },
  methods:{

    getIp () {
      logVisit(this.base + this.api_up)
    },


  }
}
</script>

<style scoped>
#all{
  text-align: left;
  padding:24px;
}


</style>