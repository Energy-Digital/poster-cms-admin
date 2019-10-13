<template>
  <div id="all">

    <WTitle txt="Your visit has marked"></WTitle>

  </div>
</template>

<script>
import WTitle from '../widgets/w_title.vue'
import { logVisitAdm } from '../../request'

export default {
  name: "visittestadm",
  components:{
    WTitle
  },
  props:{
    base: String
  },
  data(){
    return{
      api_ip: "/data/getip/",
      api_up: "/updater/visit_adm/",
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

      logVisitAdm(this.base + this.api_up)

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