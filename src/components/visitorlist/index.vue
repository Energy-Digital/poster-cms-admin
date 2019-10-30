<template>
  <div id="all">

    <WTitle txt="Visitors"></WTitle>

    <div id="list" v-loading="upLoading">
      <el-table
      :data="visitorList"
      border
      style="width: 100%">

        <el-table-column
          fixed
          prop="ip"
          label="IP"
          width="120">
        </el-table-column>

        <el-table-column
          prop="ipCountry"
          label="Country"
          width="180">
            <template slot-scope="scope">
                <div>
                    <img :src="scope.row.flagIcon" :alt="scope.row.ipCountry" style="width:20px">
                    <span> {{scope.row.ipCountry}}</span>
                </div>
            </template>
        </el-table-column>

        <el-table-column
          prop="appName"
          label="Browser"
          width="100">
        </el-table-column>

        <el-table-column
          prop="userLanguage"
          label="Language"
          width="90">
        </el-table-column>

        <el-table-column
          prop="platform"
          label="Platform"
          width="80">
        </el-table-column>

        <el-table-column
          prop="Geo Location"
          label="geoLocation"
          width="320">
          <template slot-scope="scope">
            <span @click="toMap(scope.row.geoLocation)" style="color:#409EFF;cursor:pointer;">{{scope.row.geoLocation}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="userAgent"
          label="User Agent"
          width="400">
        </el-table-column>

      </el-table>
    </div>

    <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="visitorListTotal"
            @current-change="changePage">
        </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { encGet } from '../../request'
import WTitle from '../widgets/w_title.vue'

export default {
  name: "postlist",
  components:{
    WTitle
  },
  props:{
    base: String
  },
  data(){
    return{
      api: "/data_enc/visitor_list_enc/",
      visitorList: [],
      visitorListTotal: 0,
      page:0,
      pageSize:30,
      upLoading: false,
    }
  },
  http: {
    emulateJSON: true,
    emulateHTTP: true
  },
  created(){
    this.getList(1)
    
  },
  methods:{

    getList (page) {
      this.upLoading = true
      var that = this

      // Pagination
      var limit = this.pageToLimit(page)

      var postData = {
        ls: limit,
        size: this.pageSize
      }

      encGet(this.base + this.api, postData, (res)=>{
        console.log(res.data)
        if(res.status){
          that.visitorListTotal = parseInt(res.data.total)
        
          if(that.visitorListTotal > 0){
            that.visitorList = res.data.data
            
          }
        }
        that.upLoading = false
      })

    },

    changePage (val) {
        this.getList(val)
    },

    pageToLimit ( val ) {
        return (val - 1) * this.pageSize
    },

    toMap (geo) {
        var lola = geo.split(',')
        //console.log(lola[0].slice(0,8) + ',' + lola[1].slice(0,8))
        window.open('https://wego.here.com/?map=' + lola[0].slice(0,8) + ',' + lola[1].slice(0,8) + ',13,normal')
    }


  }
}
</script>

<style scoped>
#all{
  text-align: left;
  padding:24px;
}

#list{
  margin-top: 24px;
}

.pagination{
    position: absolute;
    right: 20px;
    top: 26px;
}


</style>