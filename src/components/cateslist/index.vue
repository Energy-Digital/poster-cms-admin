<template>
  <div id="all">

    <WTitle txt="Categories"></WTitle>

    <div id="new">
      <router-link :to="{ path:'/catesingle', query: { cateId: 'new'} }">
        <el-button type="primary" plain>New</el-button>
      </router-link>
    </div>

    <div id="list" v-loading="upLoading">
      <el-table
        :data="catesList"
        border
        style="width: 100%">

        <el-table-column
          fixed
          prop="cname"
          label="Category Name"
          width="150">
        </el-table-column>

        <el-table-column
          prop="cname_sublang"
          label="分类名称"
          width="120">
        </el-table-column>

        <el-table-column
          prop="des"
          label="Description"
          width="120">
        </el-table-column>

        <el-table-column
          prop="des_sublang"
          label="分类描述"
          width="120">
        </el-table-column>

        <el-table-column
          prop="total"
          label="Posts"
          width="120">
        </el-table-column>


        <el-table-column
          fixed="right"
          label="Action"
          width="100">
          <template slot-scope="scope">
            <router-link :to="{ path:'/catesingle', query: { cateId: scope.row.id} }">
              <el-button type="text" size="small">Edit</el-button>
            </router-link>
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
  name: "cateslist",
  components:{
    WTitle
  },
  props:{
    base: String
  },
  data(){
    return{
      api: "/data/cate/",
      catesList: [],
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
            that.catesList = res.data
            that.upLoading = false
          }
        }
      })
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