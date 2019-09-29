<template>
  <div id="all">

    <WTitle txt="Categories"></WTitle>

    <div id="new">
      <el-button type="primary" v-on:click="toSMNew()" plain>New</el-button>
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
                <img :src="scope.row.icon" :alt="scope.row.name" style="width:30px">
            </div>
        </template>
        </el-table-column>


        <el-table-column
          fixed="right"
          label="Action"
          width="100">
          <template slot-scope="scope">
            <el-button @click="toSMSingle(scope.row.id)" type="text" size="small">Edit</el-button>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
    
  </div>
</template>

<script>
import { EventBus } from '../../bus'
import WTitle from '../widgets/w_title.vue'

export default {
  name: "cateslist",
  components:{
    WTitle
  },
  props:{
    
  },
  data(){
    return{
      api: "https://api.isjeff.com/pot/data/social_media/",
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
      this.axios.get(this.api).then((response) => {
        if(response.data.length === 0){
          return
        }
        that.smList = response.data
        that.upLoading = false
      })
    },

    toSMSingle (data) {
      EventBus.$emit('toSMSingle', data.id)
    },

    toSMNew () {
      EventBus.$emit('toSMSingle', "new")
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