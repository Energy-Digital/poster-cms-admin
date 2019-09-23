<template>
  <div id="all">

    <WTitle txt="All Post"></WTitle>

    <div id="new">
      <el-button type="primary" v-on:click="toSingleNew()" plain>New</el-button>
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
            <div v-if="scope.row.status == '2'" class="status" style='background:#c96f61;'>Deprecated</div>
          </template>
          
        </el-table-column>

        <el-table-column
          fixed
          prop="title"
          label="Title"
          width="150">
        </el-table-column>

        <el-table-column
          prop="cname"
          label="Category"
          width="100">
        </el-table-column>

        <el-table-column
          prop="brief"
          label="Brief"
          width="240">
        </el-table-column>

        <el-table-column
          prop="name"
          label="Author"
          width="120">
        </el-table-column>

        <el-table-column
          prop="date_pub"
          label="Publish Date"
          width="140">
        </el-table-column>

        <el-table-column
          prop="date_modi"
          label="Last Edit"
          width="140">
        </el-table-column>


        <el-table-column
          fixed="right"
          label="Action"
          width="100">
          <template slot-scope="scope">
            <el-button @click="toSingleEdit(scope.row)" type="text" size="small">Edit</el-button>
            <el-button type="text" size="small">View</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
        <el-pagination
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="postsListTotal"
            @current-change="changePage">
        </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { EventBus } from '../../bus'
import WTitle from '../widgets/w_title.vue'

export default {
  name: "postlist",
  components:{
    WTitle
  },
  props:{
    
  },
  data(){
    return{
      api: "https://api.isjeff.com/pot/data/posts_list/",
      postsList: [],
      postsListTotal: 0,
      page:0,
      pageSize:10,
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

    getList (page) {
      this.upLoading = true
      var that = this

      // Pagination
      var limit = this.pageToLimit(page)
      var api = page ? this.api + '?ls=' + limit + '&li=' + this.pageSize : this.api

      this.axios.get(api).then((response) => {
        console.log(response)
        this.postsList = response.data.data
        this.postsListTotal = parseInt(response.data.total)
        this.upLoading = false
      })
    },

    changePage (val) {
        this.getList(val)
    },

    pageToLimit ( val ) {
        return (val - 1) * 10
    },

    toSingleEdit (data) {
      EventBus.$emit('toPostSingle', data.id)
    },

    toSingleNew ( data ) {
      EventBus.$emit('toPostSingle', 'new')
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
  margin-top: -42px;
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