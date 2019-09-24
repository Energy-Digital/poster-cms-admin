<template>
  <div id="all" v-loading="upLoading">
    <div class="numbers">
      <WSubTitle txt="Highlight Data"></WSubTitle>
      <div class="numbers-cont">

        <div class="numbers-single">
          <div class="numbers-single-num"><span>{{numbersData.visitor}}</span></div>
          <div class="numbers-single-name"><span>Visitors</span></div>
        </div>

        <div class="numbers-single">
          <div class="numbers-single-num"><span>{{numbersData.postsTotal}}</span></div>
          <div class="numbers-single-name"><span>Posts</span></div>
        </div>

        <div class="numbers-single">
          <div class="numbers-single-num"><span>{{numbersData.postsLikes}}</span></div>
          <div class="numbers-single-name"><span>Likes</span></div>
        </div>

        <div class="numbers-single">
          <div class="numbers-single-num"><span>{{numbersData.postsVisit}}</span></div>
          <div class="numbers-single-name"><span>Clicked</span></div>
        </div>

      </div>
    </div>

    <div class="charts">
      <WSubTitle txt="Recent Activities"></WSubTitle>
      <div class="charts-cont">
        <div class="charts-single">
          <apexchart width="100%" height="320px" type="area" :options="chartOptionsDays" :series="chartRecentDays" v-if="loaded"></apexchart>
        </div>

        <div class="charts-single">
          <apexchart width="100%" height="320px" type="area" :options="chartOptionsHours" :series="chartRecentHours" v-if="loaded"></apexchart>
        </div>
        
      </div>
    </div>

    <div class="table" v-if="loaded">
      <WSubTitle txt="MVP (Most Views Posts)"></WSubTitle>
      <el-table
      :data="mvpList"
      stripe
      style="width: 100%">

        <el-table-column
          fixed
          prop="title"
          label="Title"
          width="720">
        </el-table-column>

        <el-table-column
          prop="ux_visit"
          label="Views"
          width="220">
        </el-table-column>

        <el-table-column
          prop="ux_likes"
          label="Likes"
          width="220">
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import { getCookie } from '../../utils'
import VueApexCharts from 'vue-apexcharts'
import WSubTitle from '../widgets/w_subtitle.vue'

export default {
  name: "home",
  props:{

  },
  components:{
    'apexchart': VueApexCharts,
    WSubTitle,
  },
  data(){
    return{
      api: "https://api.isjeff.com/pot/data_enc/count_enc/",
      numbersData: {},
      loaded: false,
      upLoading: false,
      mvpList:[],
      chartOptionsBasic: {
        chart: {
          id: 'recentVisit',
          animations: {
            enabled: true,
            easing: 'easeout',
            speed: 360,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
          }
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: ["168H", "144H", "120H", "96H", "72H", "48H", "24H"]
        }
      },
      chartOptionsDays: {},
      chartOptionsHours: {},
      chartRecentDays: [
        {
        name: 'Users',
        data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
        name: 'Admin',
        data: [0, 0, 0, 0, 0, 0, 0]
        }
      ],
      chartRecentHours: [
        {
          name: 'Users',
          data: [0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: 'Admin',
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ],

    }
  },

  created(){
    this.getData()
  },
  methods:{
    getData () {
      this.upLoading = true

      var that = this
      var postReady = {
        ukey: getCookie('u_key'), 
        uuid: getCookie('u_uuid')
      }

      var postData = this.$qs.stringify(postReady)

      this.axios.post(this.api, postData)
      .then(function (response) {

        console.log(response.data)

        that.numbersData = response.data

        var hoursChartOptions = {
          xaxis: {
            categories: ["6H", "5H", "4H", "3H", "2H", "1H", "Now"]
          }
        }
        that.chartOptionsDays = that.deepCopy(that.chartOptionsBasic)
        that.chartOptionsHours = Object.assign(that.chartOptionsBasic, hoursChartOptions)

        var daysData = that.recentVisit(that.numbersData.vts, 'days')
        var hoursData = that.recentVisit(that.numbersData.vts, 'hours')

        that.chartRecentDays[0].data = daysData.users
        that.chartRecentDays[1].data = daysData.admin
        that.chartRecentHours[0].data = hoursData.users
        that.chartRecentHours[1].data = hoursData.admin
        that.mvpList = that.numbersData.mvp
        that.loaded = true
        that.upLoading = false
        
      }).catch(function(err){
        console.log(err)
      })

      
    },

    recentVisit (arr, mode) {

      var ts = Date.parse(new Date()) / 1000
      var gap = mode === "days" ? 24*60*60 : 60*60
      var recentUsers = []
      var recentAdmin = []

      for(var i=1;i<=7;i++){
        var usersCount = 0
        var adminCount = 0
        for(var ii=0;ii<arr.length;ii++){
          if(arr[ii].ts > ts - (gap * i) && arr[ii].ts < ts - (gap * (i - 1))){
            if(arr[ii].isAdmin == 1){
              adminCount = adminCount + 1
            } else {
              usersCount = usersCount + 1
            }
            
          }
          if(ii == arr.length - 1){
            recentUsers.push(usersCount)
            recentAdmin.push(adminCount)
          }
        }
        
      }

      return { users: recentUsers.reverse(), admin: recentAdmin.reverse() }
    },


    deepCopy (obj) {
      return JSON.parse(JSON.stringify(obj))
    }
  }
}
</script>

<style scoped>

#all{
  text-align: left;
  padding:24px;
}

.numbers{
  width: 100%;
}

.numbers-cont{
  width:1000px;
  display: flex;
  text-align:center;
  margin-top: 40px;
  margin-left:auto;
  margin-right:auto;
}

.numbers-single{
  width:250px;
  height:100px;
}

.numbers-single-num span{
  font-size:36px;
  font-weight: bold;
}

.numbers-single-name span{
  font-size:16px;
  font-weight: normal;
  opacity: .7;
}

.charts{

}

.charts-cont{
  width:100%;
  display:flex;
  flex-wrap: wrap;
}

.charts-single{
  width:50%;
}

.table{
  width:100%;
}
</style>