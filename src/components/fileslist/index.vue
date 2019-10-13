<template>
  <div id="all">

    <WTitle txt="Media Library"></WTitle>

    <div id="new">
      <el-button type="primary" v-on:click="toNewFile()" plain>Add</el-button>
    </div>

    <div class="pagination">
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="filesListTotal"
            @current-change="changePage">
        </el-pagination>
    </div>

    <div class="searchBar">
        <el-input v-model="searchVal" placeholder="Search" clearable></el-input>
        <el-button type="primary" v-on:click="search()">Find</el-button>
    </div>

    <div id="list" v-loading="upLoading">

        <div id="file-grid">
            <div class="file-single" v-for="item in filesListAll" :key="item.id" >
                <div class="file-single-img">
                    <el-image
                        class="file-single-img-img"
                        :style="item.type_des === 'Image' ? 'width: 180px; height: 180px' : 'width: 60px; height: 60px;margin-top: 60px;margin-left: 30px;'"
                        :src="item.type_des === 'Image' ? base + item.path : base + static_icons_url + getIcon(item.type)"
                        :fit="item.type_des === 'Image' ? 'contain' : 'scale-down'"
                        :preview-src-list="[base + item.path]"
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
                    <div class="file-single-btn" v-on:click="toCopyLink(base + item.path)">
                        <span>URL</span>
                    </div>

                    <div class="file-single-btn" v-on:click="toOpenFile(base + item.path)">
                        <span>Open</span>
                    </div>

                    <div class="file-single-btn" v-on:click="toDelFile(item.id, item.path, item.seed)">
                        <span style="color:#F56C6C;">Remove</span>
                    </div>
                </div>
                
            </div>
        </div>

    </div>

    <upload-window 
        v-if="upload_win" 
        @uploaded="uploadHandler" 
        @close="closeUpWin" 
        :base="base"
        :allowMultiple="true" 
        :allowUrl="false" 
        :allowSelect="false">
    </upload-window>
    
  </div>
</template>

<script>
import { getFileIcon, strLenLimit } from '../../utils.js'
import { genGet, delFile } from '../../request'
import WTitle from '../widgets/w_title.vue'
import uploadWindow from '../widgets/w_upload.vue'

export default {
  name: "fileslist",
  components:{
    WTitle,
    uploadWindow
  },
  props:{
    base: String
  },
  data(){
    return{
        static_icons_url: "/static/icons/",
        api: "/manager/all_media/",
        api_file_del: "/manager/file_del/",
        api_search: "/manager/s_media/",
        filesListAll: [],
        filesListRes: [],
        filesListTotal: 0,
        searchVal: "",
        page:1,
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
    this.getList(1)
  },
  watch:{
      searchVal:function (){
          if(this.searchVal.length === 1){
              this.searchClear()
          }
      }
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
        var param = [{
            name: "ls",
            val: limit
        },{
            name: "size",
            val: this.pageSize
        },{
            name:"file",
            val: "all"
        }]

        genGet(this.base + this.api, param, (res)=>{
            if(res.status){
                that.filesListTotal = parseInt(res.data.total)
                if(that.filesListTotal > 0){
                    that.$nextTick(()=>{
                        that.filesListRes = res.data.data
                        that.filesListAll = that.filesListRes
                    })
                }
            }

            that.upLoading = false
        })

        
    },

    search () {
        var that = this
        var param = [{
            name: "s",
            val: this.searchVal
        }]
        genGet(this.base + this.api_search, param, (res)=>{
            console.log(res)
            that.filesListAll = res.data
        })
    },

    searchClear () {
        this.filesListAll = this.filesListRes
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

    toDelFile (id, path, seed) {
        
        var that = this

        seed = seed != "-1" ? seed : "no"

        this.$confirm('You will delete a file permanently, continue?', 'Alert', {
            confirmButtonText: 'DELETE',
            cancelButtonText: 'Cancel',
            type: 'warning'
        }).then(() => {

                that.upLoading = true
            
                var postReady = {
                    fid: id,
                    fseed: seed,
                    fpath: path
                }

                delFile(that.base + that.api_file_del, postReady, (res)=>{
                    if(res.status === 1 || res.status === 2){
                        that.$notify({
                            title: 'Deleted',
                            type: 'success'
                        })
                        that.updateAll()
                    } 
                    
                    else if(res.status === 3) {
                        that.$notify({
                            title: "Can't delete record, file remains.",
                            message: 'Error:' + res.data,
                            type: 'warning'
                        })
                    } 
                    
                    else if(res.status === 4){
                        that.$notify({
                            title: "Record deleted, can't delete the file",
                            message: 'Error:' + res.data,
                            type: 'warning'
                        })
                    } 

                    else{
                        that.$notify({
                            title: "Unknow error",
                            message: 'Error:' + res.error,
                            type: 'warning'
                        })
                    }

                    
                    that.upLoading = false
                })


        }).catch(() => {
            that.$notify({
                title: 'Cancelled',
                type: 'warning'
            })
        })
    },

    updateAll () {
        this.filesListAll = []
        this.getList(this.page)
    },

    realFileName (str, limit) {
        var res
        var parse = str.split('_')
        res = strLenLimit(parse[parse.length-1], limit)

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

.searchBar{
    width: 300px;
    position: absolute;
    left: 200px;
    top: 22px;
    display: flex;
}

.searchBar input{
    height: 32px;
}

.searchBar button{
    height: 32px;
    width: 54px;
    margin-left: 12px;
    padding-left: 13px;
    padding-top: 8px;
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