<template>
  <div id="all" v-loading="themeImporting">

    <WTitle txt="Themes"></WTitle>

    <div id="new">
        <el-upload
            class="upload-demo"
            action="0"
            :http-request="importTheme"
            :show-file-list="false">
            <el-button size="small" type="primary" plain>Import Theme</el-button>
            <!--div slot="tip" class="el-upload__tip">JSON File</div-->
        </el-upload>
    </div>


    <div id="list" v-loading="upLoading">

        <div id="file-grid">
            <span v-if="themesListAll.length < 1">List is empty</span>
            <div class="theme" v-for="item in themesListAll" :key="item.id" >
                <div class="theme-img">
                    <el-image
                        class="theme-img-img"
                        style="width: 400px; height: 280px"
                        fit="contain"
                        :src="item.preview"
                        :preview-src-list="[item.preview]"
                        lazy>

                        <div slot="placeholder" class="au_img_placeholder">
                            <span>Loading</span>
                        </div>

                    </el-image>

                </div>

                <div class="theme-inner">
                    <div class="theme-info">
                        <span>Name: {{item.name}}</span><br>
                        <span>Version: {{item.version}}</span><br>
                        <span>Author: {{item.author}}</span>
                    </div>

                    <div class="theme-action">
                        
                        <div class="theme-action-single" v-on:click="useTheme(item.id)">
                            <el-button type="primary" size="small" v-if="activeTheme != item.id">Use</el-button>
                            <el-button type="info" size="small" v-if="activeTheme == item.id" disabled>Current</el-button>
                        </div>

                        <div class="theme-action-single" v-on:click="del(item.id)">
                            <el-button type="danger" size="small" plain>Remove</el-button>
                        </div>
                    </div>
                </div>

                
                
            </div>
        </div>

    </div>

    <!--upload-window v-if="upload_win" @uploaded="uploadHandler" @close="closeUpWin" :allowMultiple="true" :allowUrl="false" :allowSelect="false"></upload-window-->
    
  </div>
</template>

<script>
import { encodeRichText } from '../../utils.js'
import { genGet, genUpdate } from '../../request'
import WTitle from '../widgets/w_title.vue'

export default {
  name: "themeslist",
  components:{
    WTitle
  },
  props:{
      base: String
  },
  data(){
    return{
        static_icons_url: "/static/icons/",
        api: "/data/themes/",
        api_up: "/updater/theme/",
        api_setTheme: "/updater/basic/",
        themesListAll: [],
        activeTheme: "",
        mode: "new",
        upload_win: false,
        upLoading: false,
        themeImporting: false,
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

    uploadHandler () {
        this.updateAll()
    },

    closeUpWin () {
        this.upload_win = false
    },

    getList () {
        this.upLoading = true
        var that = this

        genGet(this.base + this.api, [], (res)=>{
            
            if(res.status){
                that.activeTheme = res.data.activeTheme
                that.themesListAll = res.data.data
            }
            that.upLoading = false
        })

    },

    importTheme (obj){
        this.themeImporting = true
        
        var that = this
        var themeData = {}
        const reader = new FileReader()
        
        reader.onload = function(e) {

            themeData = JSON.parse(reader.result)
            themeData.mode = "new"
            themeData.data_struct = encodeRichText(JSON.stringify(themeData.data_struct))

            that.$message('Importing theme ... this may take a while');

            genUpdate(that.base + that.api_up, themeData, (res)=>{
                if(res.status){
                    that.$notify({
                        title: 'Theme Imported',
                        type: 'success'
                    })
                    that.updateAll()
                } else {
                    that.$notify({
                        title: 'Error: ' + res.data,
                        type: 'warning'
                    })
                }
                that.themeImporting = false
            })
        }
        reader.readAsText(obj.file)

    },

    del (id) {
        
        var that = this

        this.$confirm('You will delete a theme permanently, continue?', 'Alert', {
            confirmButtonText: 'DELETE',
            cancelButtonText: 'Cancel',
            type: 'warning'
        }).then(() => {

                that.upLoading = true
            
                var postReady = {
                    id: id,
                    mode: "del"
                }

                genUpdate(that.base + that.api_up, postReady, (res)=>{
                    if(res.status){
                        that.$notify({
                            title: 'Deleted',
                            type: 'success'
                        })
                        that.updateAll()
                    } else {
                        that.$notify({
                            title: "Unknow error",
                            message: 'Error:' + res.err,
                            type: 'warning'
                        })
                    }
                })


        }).catch((err) => {
            that.$notify({
                title: 'Cancelled',
                type: 'warning'
            })
        })
        that.upLoading = false
    },

    useTheme(id){
        var that = this

        this.upLoading = true

        var postReady = { currentThemeId: id, mode: "theme" }

        genUpdate(this.base + this.api_setTheme, postReady, (res)=>{
            if(res.status){

                that.$notify({
                    title: 'Success',
                    type: 'success'
                })

            } else {

                that.$notify({
                    title: 'Error:' + res.data,
                    type: 'warning'
                })
            }
            that.upLoading = false
        })
    },

    updateAll () {
        this.themesListAll = []
        this.activeTheme = ""
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

#list{
    margin-top: 24px;
    min-height: 540px;
}

#file-grid{
    display: flex;
    flex-wrap: wrap;
}

.theme{
    width:400px;
    height: 342px;
    margin-right:20px;
    margin-bottom:20px;
    border:1px dashed rgba(0,0,0,0.1);
    border-radius: 4px;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

.theme-img{
    display:flex;
    width:400px;
    height:280px;
}

.theme-inner{
    position:relative;
    width:100%;
    height:48px;
    display:flex;
}


.theme-des{
    width: 60px;
    margin-top: 74px;
    font-size: 12px;
    font-weight: bold;
    opacity: 0.7;
}

.theme-action{
    position:absolute;
    right:10px;
    display: flex;
    flex-wrap: wrap;
    background:rgba(0,0,0,0.01);
}

.theme-btn{
    font-size: 12px;
    opacity: 0.9;
    color: #333333;
    width: 50%;
    height: 24px;
    cursor: pointer;
    padding-top: 14px;
    text-align: center;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

.theme-btn:hover{
    opacity: 1;
}

.status{
  color:#ffffff;
  border-radius:4px;
  text-align:center;
}

.theme-info{
    margin-left:10px;
    opacity: 0.7;
    font-size:14px;
}

.theme-action-single{
    margin-left:6px;
}
</style>