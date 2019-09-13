<template>
  <div id="all">

    <WTitle txt="All Categories"></WTitle>

    <div id="list">
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
          <el-button @click="handleClick(scope.row)" type="text" size="small">Edit</el-button>
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
      api: "http://api.isjeff.com/pot/data/post_cate/",
      catesList: []
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
        this.catesList = res
      })
    },

    handleClick (data) {
      EventBus.$emit('toCateSingle', data.id)
    }

  }
}
</script>

<style scoped>
#all{
  text-align: left;
  padding:24px;
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