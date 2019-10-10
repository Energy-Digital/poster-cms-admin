<template>
  <div id="all">

    <WTitle txt="All Posts"></WTitle>

    <div id="new">
      <router-link :to="{ path:'/postsingle', query: { pid: 'new'} }">
        <el-button type="primary" plain>New</el-button>
      </router-link>
    </div>

    <div id="list" v-loading="upLoading">
      <el-table
      :data="postsList"
      border
      style="width: 100%">

        <el-table-column
          fixed
          prop="status"
          label="Status"
          width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.status == '0'" class="status" style='background:#c9a661;'>Draft</div>
            <div v-if="scope.row.status == '1'" class="status" style='background:#61c995;'>Published</div>
            <div v-if="scope.row.status == '3'" class="status" style='background:#618BC9;'>Unlisted</div>
            <div v-if="scope.row.status == '2'" class="status" style='background:#c96f61;'>Deprecated</div>
          </template>
          
        </el-table-column>

        <el-table-column
          fixed
          prop="title"
          label="Title"
          width="300">
          <template slot-scope="scope">
            <span style="font-weight: bold; word-wrap: break-word;">{{parseTextLimit(scope.row.title, 64)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="cname"
          label="Category"
          width="90">
        </el-table-column>

        <!--el-table-column
          prop="brief"
          label="Brief"
          width="240">
          <template slot-scope="scope">
            <span>{{parseTextLimit(scope.row.brief, 36)}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="Author"
          width="100">
        </el-table-column-->

        <el-table-column
          prop="date_pub"
          label="Publish Date"
          width="160">
        </el-table-column>

        <el-table-column
          prop="date_modi"
          label="Last Edit"
          width="160">
        </el-table-column>

        <el-table-column
          prop="ux_likes"
          label="Likes"
          width="120">
        </el-table-column>

        <el-table-column
          prop="ux_visit"
          label="Views"
          width="120">
        </el-table-column>

        <el-table-column
          fixed="right"
          label="Order"
          width="60">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-on:click="postOrder(scope.row.id, scope.row.listOrder, 'up')" :disabled="scope.row.listOrder == 1"><i class="el-icon-top"></i></el-button>
            <el-button type="text" size="small" v-on:click="postOrder(scope.row.id, scope.row.listOrder, 'down')" :disabled="scope.row.listOrder == postsListTotal"><i class="el-icon-bottom"></i></el-button>
          </template>
        </el-table-column>


        <el-table-column
          fixed="right"
          label="Action"
          width="120">
          <template slot-scope="scope">
            <router-link :to="{ path:'/postsingle', query: { pid: scope.row.id} }">
              <el-button type="text" size="small">Edit</el-button>
            </router-link>
            <el-button type="text" size="small">View</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="postsListTotal"
          @current-change="changePage">
        </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { strLenLimit } from '../../utils'
import { genGet, genUpdate } from '../../request'
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
      api: "/data/posts_list/",
      api_order: "/updater/post_order/",
      postsList: [],
      postsListTotal: 0,
      page:0,
      pageSize:10, // 10, 20, 30
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
      var param = page ? [ 
        {
          name: "ls", 
          val: limit
        }, 
        { name: "size",
          val: this.pageSize
        } 
      ] : []

      genGet(this.base + this.api, param, (res)=>{
        if(res.status){
          that.postsListTotal = parseInt(res.data.total)
        
          if(that.postsListTotal > 0){
            that.postsList = res.data.data
          }
        }
        that.upLoading = false
      })

    },

    postOrder (id, order, mode) {

      

      if(mode === "up" && order == 1){
        
        return
      }

      if(mode === "down" && order == this.postsListTotal){
        return
      }

      this.upLoading = true


      var that = this
      var postData = {
        mode: mode,
        pid: id,
        order: order
      }
      genUpdate(this.base + this.api_order, postData, (res)=>{
        if(res.status){
          that.getList(that.page)
        }
      })
    },

    changePage (val) {
        this.getList(val)
    },

    pageToLimit ( val ) {
        return (val - 1) * 10
    },


    parseTextLimit (str, limit) {
      return strLenLimit(str, limit)
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

.pagination{
    position: absolute;
    right: 100px;
    top: 26px;
}

.status{
  color:#ffffff;
  border-radius:4px;
  text-align:center;
}
</style>