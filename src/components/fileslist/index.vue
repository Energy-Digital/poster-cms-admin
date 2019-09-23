<template>
  <div id="all">

    <WTitle txt="Media Library"></WTitle>

    <div id="new">
      <el-button type="primary" v-on:click="toNewFile()" plain>Add</el-button>
    </div>

    <div id="list" v-loading="upLoading">

        <div id="file-grid">
            <div class="file-single" v-for="item in filesListAll" :key="item.id" >
                <div class="file-single-img">
                    <el-image
                        class="file-single-img-img"
                        :style="item.type_des === 'Image' ? 'width: 180px; height: 180px' : 'width: 60px; height: 60px;margin-top: 60px;margin-left: 30px;'"
                        :src="item.type_des === 'Image' ? base_url + item.path : base_url + static_icons_url + getIcon(item.type)"
                        :fit="item.type_des === 'Image' ? 'contain' : 'scale-down'"
                        :preview-src-list="[base_url + item.path]"
                        lazy>

                        <div slot="placeholder" class="au_img_placeholder">
                            <span>Loading</span>
                        </div>

                    </el-image>

                    <span v-if="item.type_des !== 'Image'" class="file-single-des">
                        {{item.type_des}}
                    </span>

                </div>

                <div class="file-single-action">
                    <div class="file-name">
                        <span>{{realFileName(item.name, 18)}}</span>
                    </div>
                    <div class="file-single-btn" v-on:click="toCopyLink(base_url + item.path)">
                        <span>URL</span>
                    </div>

                    <div class="file-single-btn" v-on:click="toOpenFile(base_url + item.path)">
                        <span>Open</span>
                    </div>

                    <div class="file-single-btn" v-on:click="toDelFile(item.id, item.path)">
                        <span style="color:#F56C6C;">Remove</span>
                    </div>
                </div>
                
            </div>
        </div>

    </div>

    <div class="pagination">
        <el-pagination
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="filesListTotal"
            @current-change="changePage">
        </el-pagination>
    </div>

    <upload-window v-if="upload_win" @uploaded="uploadHandler" @close="closeUpWin" :allowUrl="false" :allowSelect="false"></upload-window>
    
  </div>
</template>

<script>
import { EventBus } from '../../bus'
import { getCookie, getFileIcon } from '../../utils.js'
import WTitle from '../widgets/w_title.vue'
import uploadWindow from '../widgets/w_upload.vue'

export default {
  name: "fileslist",
  components:{
    WTitle,
    uploadWindow
  },
  props:{
    
  },
  data(){
    return{
        base_url: "https://api.isjeff.com/pot",
        static_icons_url: "/static/icons/",
        api: "https://api.isjeff.com/pot/manager/all_media/",
        api_img_del: "https://api.isjeff.com/pot/manager/img_del/",
        filesListAll: [],
        filesListTotal: 0,
        page:0,
        pageSize:10,
        upload_win: false,
        upLoading: false,
    }
  },
  http: {
    emulateJSON: true,
    emulateHTTP: true
  },
  created(){
    var that = this
    this.getList(1)
  },
  methods:{

    uploadHandler () {
        this.updateAll()
    },

    closeUpWin () {
        this.upload_win = false
    },

    getList (page) {
        this.upLoading = true
        var that = this

        // Set page size by screen width
        this.pageSize = Math.floor(window.innerWidth / 120)
        if(this.pageSize % 2 != 0){
            this.pageSize++
        }

        // pagination Limit
        var limit = this.pageToLimit(page)
        var api = page ? this.api + '?ls=' + limit + '&li=' + this.pageSize : this.api

        this.axios.get(api).then(function (response) {

            if(response.data){
                that.filesListTotal = parseInt(response.data.total)

                that.$nextTick(()=>{
                    that.filesListAll = response.data.data
                })

            } else {
                that.$notify({
                    title: 'Unable to get all files',
                    message: 'Error: ' + res,
                    type: 'warning'
                })
            }
            

            that.upLoading = false
        })
    },

    changePage (val) {
        this.getList(val)
    },

    pageToLimit ( val ) {
        return (val - 1) * 10
    },

    getIcon (str) {
        return getFileIcon(str)
    },

    toNewFile (){
        this.upload_win = true
    },


    toCopyLink (link) {

        // Copy
        this.$clipboard(link)

        // Alert
        this.$notify({
          title: 'URL has copied',
          type: 'success'
        })
    },

    toOpenFile (link) {
        window.open(link)
    },

    toDelFile (id, path) {
        
        var that = this

        this.$confirm('You will delete a file permanently, continue?', 'Alert', {
            confirmButtonText: 'DELETE',
            cancelButtonText: 'Cancel',
            type: 'warning'
        }).then(() => {

                that.upLoading = true
            
                var postReady = {
                    ukey: getCookie('u_key'), 
                    uuid: getCookie('u_uuid'), 
                    fid: id,
                    fpath: path
                }

                var postData = this.$qs.stringify(postReady)


                that.axios.post(this.api_img_del, postData)
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
                    that.upLoading = false
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

                that.upLoading = false
                
            })

        }).catch((err) => {
            that.upLoading = false
        })
    },

    updateAll () {
        this.filesListAll = []
        this.getList(this.page)
    },

    realFileName (str, limit) {
        var res
        var parse = str.split('_')
        res = parse[parse.length-1].length < limit ? parse[parse.length-1] : parse[parse.length-1].slice(0, limit) + '...'

        return res
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

#list{
    margin-top: 24px;
    min-height: 540px;
}

#file-grid{
    display: flex;
    flex-wrap: wrap;
}

.file-single{
    width:180px;
    height: 244px;
    margin-right:20px;
    margin-bottom:20px;
    border:1px dashed rgba(0,0,0,0.1);
    border-radius: 4px;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

.file-single:hover{
    box-shadow: 0 6px 10px rgba(0,0,0,0.04), 0 6px 6px rgba(0,0,0,0.02);
}

.file-single-img{
    display:flex;
    width:180px;
    height:180px;
}


.file-single-des{
    width: 60px;
    margin-top: 74px;
    font-size: 12px;
    font-weight: bold;
    opacity: 0.7;
}

.file-single-action{
    display: flex;
    flex-wrap: wrap;
    width:100%;
    background:rgba(0,0,0,0.01);
}

.file-name{
    width:100%;
    height: 24px;
    color:#555;
    text-align: center;
}

.file-single-btn{
    font-size: 12px;
    opacity: 0.9;
    color: #3F9EFF;
    width: 33%;
    height: 24px;
    cursor: pointer;
    padding-top: 14px;
    text-align: center;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

.file-single-btn:hover{
    opacity: 1;
}

.status{
  color:#ffffff;
  border-radius:4px;
  text-align:center;
}
</style>