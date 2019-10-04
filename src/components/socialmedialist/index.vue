<template>
  <div id="all">

    <WTitle txt="Social Media"></WTitle>

    <div id="new">
      <router-link :to="{ path:'/socialmediasingle', query: { smId: 'new'} }">
        <el-button type="primary" plain>New</el-button>
      </router-link>
    </div>

    <div id="list" v-loading="upLoading">
      <el-table
        :data="smList"
        border
        style="width: 100%">

        <el-table-column
          fixed
          prop="name"
          label="Name"
          width="150">
        </el-table-column>

        <el-table-column
          prop="url"
          label="URL"
          width="300">
          <template slot-scope="scope">
            <span @click="toLink(scope.row.url)" style="color:#409EFF;cursor:pointer;">{{scope.row.url}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="icon"
          label="icon"
          width="120">
          <template slot-scope="scope">
            <div>
                <img :src="base + scope.row.icon" :alt="scope.row.name" style="width:30px">
            </div>
        </template>
        </el-table-column>


        <el-table-column
          fixed="right"
          label="Action"
          width="100">
          <template slot-scope="scope">
            <router-link :to="{ path:'/socialmediasingle', query: { smId: scope.row.id} }">
              <el-button type="text" size="small">Edit</el-button>
            </router-link>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
    
  </div>
</template>

<script>
import { genGet } from '../../request'
import WTitle from '../widgets/w_title.vue'

export default {
  name: "socialmedialist",
  components:{
    WTitle
  },
  props:{
    base: String
  },
  data(){
    return{
      api: "/data/social_media/",
      smList: [],
      upLoading: false,
    }
  },
  http: {
    emulateJSON: true,
    emulateHTTP: true
  },
  created(){
    this.getList()
  },
  methods:{

    getList () {
      this.upLoading = true
      var that = this
      genGet(this.base + this.api, [], (res)=>{
        if(res.status){
          if(res.data.length > 0){
            that.smList = res.data
            that.upLoading = false
          }
        }
      })
    },

    toLink (url) {
        window.open(url)
    },

  }
}
</script>

<style scoped>
#all{
  text-align: left;
  padding:24px;
}

#new {
  margin-top: -36px;
  margin-bottom: 14px;
  float: right;
}

#title{
  font-size:36px;
  font-weight: bold;
}

.status{
  color:#ffffff;
  border-radius:4px;
  text-align:center;
}
</style>