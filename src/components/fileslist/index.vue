<template>
  <div id="all">

    <WTitle txt="Media Library"></WTitle>

    <div id="new">
      <el-button type="primary" v-on:click="toNewFile()" plain>Add</el-button>
    </div>

    <div id="list">
      <el-table
      :data="filesList"
      border
      style="width: 100%"
      v-if="tableShow">

        <el-table-column
          fixed
          label="Preview"
          width="120">
            <template slot-scope="scope">
                <div v-if="scope.row.type === 'image'">
                    <el-image
                        class="tableImage"
                        style="width: 100px; height: 100px"
                        :src="base_url + scope.row.path"
                        fit="contain"
                        :preview-src-list="[base_url + scope.row.path]">

                        <div slot="placeholder" class="au_img_placeholder">
                            <span>Loading</span>
                        </div>
                        
                    </el-image>
                </div>
            </template>
        </el-table-column>

        <el-table-column
          fixed
          prop="path"
          label="Path"
          width="400">
        </el-table-column>

        <el-table-column
          prop="type"
          label="Tpye"
          width="60">
        </el-table-column>

        <el-table-column
          fixed="right"
          label="Action"
          width="140">
          <template slot-scope="scope">
            <el-button @click="toCopyLink(base_url + scope.row.path)" type="text" size="small">Link</el-button>
            <el-button @click="toOpenFile(base_url + scope.row.path)" type="text" size="small">View</el-button>
            <el-button @click="toDelFile(scope.row.id, scope.row.type, scope.row.path)" type="text" size="small">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
  </div>
</template>

<script>
import { EventBus } from '../../bus'
import { getCookie } from '../../utils.js'
import WTitle from '../widgets/w_title.vue'

export default {
  name: "fileslist",
  components:{
    WTitle
  },
  props:{
    
  },
  data(){
    return{
        base_url: "https://api.isjeff.com/pot",
        api: "https://api.isjeff.com/pot/manager/all_media/",
        api_img_del: "https://api.isjeff.com/pot/manager/img_del/",
        filesList: [],
        tableShow: true
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
        this.axios.get(this.api).then(function (response) {

            if(response.data){
                var res = response.data

                res.forEach((el, index) => {
                    var ft = el.path.split(".")
                    res[index].type = that.parseFileType(ft[ft.length - 1])
                })

                that.$nextTick(()=>{
                    that.filesList = res
                })

            } else {
                that.$notify({
                    title: 'Unable to get all files',
                    message: 'Error: ' + res,
                    type: 'warning'
                })
            }
            
        })
    },

    parseFileType (str) {
        switch (str) {

            case 'png':
                return "image"
            break

            case 'PNG':
                return "image"
            break

            case 'jpg':
                return "image"
            break

            case 'JPG':
                return "image"
            break

            case 'jpeg':
                return "image"
            break

            case 'JPEG':
                return "image"
            break

            case 'PDF':
                return "PDF"
            break

            case 'doc':
                return "Word Document"
            break

            case 'docx':
                return "Word Document"
            break


        }
    }, 

    toCopyLink (link) {

        // Copy
        this.$clipboard(link)

        // Alert
        this.$notify({
          title: 'Link has copied',
          type: 'success'
        })
    },

    toOpenFile (link) {
        window.open(link)
    },

    toDelFile (id, type, path) {
        var that = this

        this.$confirm('You will delete a file permanently, continue?', 'Alert', {
            confirmButtonText: 'DELETE',
            cancelButtonText: 'Cancel',
            type: 'warning'
        }).then(() => {
            
            var postReady = {
                ukey: getCookie('u_key'), 
                uuid: getCookie('u_uuid'), 
                fid: id,
                fpath: path
            }

            var postData = this.$qs.stringify(postReady)

            // API区分，以后可能是要检查是否使用了图片或文件的
            var delApi = type == "image" ? this.api_img_del : ""

            that.axios.post(delApi, postData)
            .then(function (response) {

            var res = response.data

            var delRes = res.split(';')

            if(delRes[0].indexOf("dbs") != -1 && delRes[1].indexOf("del") != -1){
                that.$notify({
                    title: 'Success',
                    message: 'File has been removed',
                    type: 'success'
                })

                // Need to re-define this update function when split pages 
                that.updateAll()
                return
            } 
            
            if (delRes[0].indexOf("dbe") != -1){
                that.$notify({
                    title: "Can't delete record",
                    message: 'Error:' + res,
                    type: 'warning'
                })
            }

            if (delRes[1].indexOf("nodel") != -1){
                that.$notify({
                    title: "Can't delete file",
                    message: 'Error:' + res,
                    type: 'warning'
                })
            }
            
        })

        }).catch(() => {
            
        })
    },

    updateAll () {
        this.filesList = []
        this.getList()
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

.tableImage{
    z-index: 12000;
}
</style>