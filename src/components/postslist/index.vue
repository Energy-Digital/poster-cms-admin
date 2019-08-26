<template>
  <div id="all">

    <WTitle txt="All Post"></WTitle>

    <div id="list">
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
          <div v-if="scope.row.status == '1'" class="status" style='background:#61c995;'>Publish</div>
          <div v-if="scope.row.status == '2'" class="status" style='background:#c96f61;'>Removed</div>
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
        width="120">
      </el-table-column>

      <el-table-column
        prop="brief"
        label="Brief"
        width="120">
      </el-table-column>

      <el-table-column
        prop="name"
        label="Author"
        width="120">
      </el-table-column>

      <el-table-column
        prop="date_pub"
        label="Publish Date"
        width="120">
      </el-table-column>

      <el-table-column
        prop="date_modi"
        label="Last Edit"
        width="300">
      </el-table-column>


      <el-table-column
        fixed="right"
        label="Action"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">View</el-button>
          <el-button type="text" size="small">Edit</el-button>
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
  name: "postlist",
  components:{
    WTitle
  },
  props:{
    
  },
  data(){
    return{
      api: "https://api.isjeff.com/pot/data/posts_list/",
      postsList: []
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
      var that = this
      this.axios.get(this.api).then((response) => {
        var res = response.data
        console.log(res)
        this.postsList = res
      })
    },

    parseStatus (val) {
      var res
      switch (val) {
        case "0":
          res = "Saved"
          break

        case "1":
          res = "Published"
          break
        
        case "2":
          res = "Removed"
          break

        default:
          res = "Saved"
      }

      return res
    },

    handleClick (data) {
      EventBus.$emit('toPostSingle', data.id)
    }

  }
}
</script>

<style scoped>
#all{
  text-align: left;
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