<template>
  <div id="all">

    <WTitle txt="Navigation Bar"></WTitle>

    <div id="new">
      <el-button type="primary" v-on:click="toNavNew()" plain>New</el-button>
    </div>

    <div id="list" v-loading="upLoading">
      <el-table
        :data="navsList"
        border
        style="width: 100%">

        <el-table-column
          fixed
          prop="name"
          label="Name"
          width="150">
        </el-table-column>

        <el-table-column
          fixed
          prop="name_sublang"
          label="坝称"
          width="150">
        </el-table-column>

        <el-table-column
          prop="url"
          label="URL"
          width="300">
        </el-table-column>


        <el-table-column
          fixed="right"
          label="Action"
          width="100">
          <template slot-scope="scope">
            <el-button @click="toNavSingle(scope.row)" type="text" size="small">Edit</el-button>
          </template>
        </el-table-column>
        
      </el-table>
    </div>
    
  </div>
</template>

<script>
import { EventBus } from '../../bus'
import WTitle from '../widgets/w_title.vue'

import { genGet } from '../../request'

export default {
  name: "navslist",
  components:{
    WTitle
  },
  props:{
    
  },
  data(){
    return{
      api: "https://api.isjeff.com/pot/data/layout_nav/",
      navsList: [],
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
      
      genGet(this.api, [], (res)=>{
        if(res.status){
          if(res.data.length > 0){
            that.navsList = res.data
            that.upLoading = false
          }
        }
      })
    },

    toNavSingle (data) {
      EventBus.$emit('toNavSingle', data.id)
    },

    toNavNew () {
      EventBus.$emit('toNavSingle', "new")
    }

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