<template>
  <div id="all">

    <WTitle txt="Your visit has marked"></WTitle>

  </div>
</template>

<script>
import { EventBus } from '../../bus'
import WTitle from '../widgets/w_title.vue'
import { setCookieExInMin, getCookie } from '../../utils'

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
      api_getIpInfo: "http://api.ipstack.com/",
      api_key: "?access_key=4a0d7c9b3e1b25a888b23bea248723dd",
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

    setTracker () {
        var tmpUid = parseInt(Math.ceil(Math.random()*1000) * Date.parse( new Date()) / 10000000)
        setCookieExInMin('isjeffcom', tmpUid, 1)
    },

    getIp () {

        if(getCookie('isjeffcom')){
            return
        }

        var that = this

        this.axios.get(this.base + this.api_ip).then((response) => {
          

            that.userInfoRes.ip = response.data
            that.userInfoRes.userAgent = navigator.userAgent
            that.userInfoRes.userLanguage = navigator.language
            that.userInfoRes.appName = navigator.appName
            that.userInfoRes.platform = navigator.platform


            if(response.data.length > 1){

                that.axios.get(that.api_getIpInfo + response.data + that.api_key).then((response)=>{
                    var res = response.data

                    that.userInfoRes.ipCountryCode = res.country_code
                    that.userInfoRes.ipCountry = res.country_name
                    that.userInfoRes.geoLocation = res.latitude + ',' + res.longitude
                    that.userInfoRes.flagIcon = res.location.country_flag
                    that.userInfoRes.isAdmin = 1

                    

                    var postReady = {
                        ukey: getCookie('u_key'), 
                        uuid: getCookie('u_uuid'), 
                    }

                    postReady = Object.assign(that.userInfoRes, postReady)
                    var postData = that.$qs.stringify(postReady)

                    that.axios.post(that.base + that.api_up, postData)
                    .then(function (response) {
                        if(response.data.indexOf("success") != -1){
                          console.log('Visit Loged')
                        }
                    })

                    //that.setTracker()

                })

            } else {
                that.axios.post(that.base + that.api_up, postData)
                .then(function (response) {
                    if(response.data.indexOf("success") != -1){
                      console.log('Visit Loged')
                    }
                })

                //that.setTracker()
            }
        })

      
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