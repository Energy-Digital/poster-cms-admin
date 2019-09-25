<template>
  <div id="all" v-loading="upLoading">

    <div id="post-title">
      <!--WTitle txt="Edit Post"></WTitle-->
      <el-page-header @back="goBack" title="Back" content="Edit Post"></el-page-header>

      <div id="post-lang-selector">
        <el-radio-group v-model="postLang" style="margin-bottom: 30px;">
          <el-radio-button label="0">ENG</el-radio-button>
          <el-radio-button label="1">中文</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div id="post-cont" v-if="contOpen">
      
      <div class="pc-b" id="pc-title">
        <WSubTitle txt="Title"></WSubTitle>
        <el-input v-model="postData.title" placeholder="Article Title (4 Char +)" v-if="postLang === '0'"></el-input>
        <el-input v-model="postData.title_sublang" placeholder="请输入标题" v-if="postLang === '1'"></el-input>
      </div>

      <div class="pc-b" id="pc-content" v-if="loaded">
        <div id="pc-editmode-selector">
          <el-tabs v-model="editMode" type="card">
            <el-tab-pane label="Visual" name="view"></el-tab-pane>
            <el-tab-pane label="Text" name="source"></el-tab-pane>
          </el-tabs>
          <!--el-radio-group v-model="editMode" style="margin-bottom: 30px;">
            <el-radio-button label="view">Visual</el-radio-button>
            <el-radio-button label="source">Text</el-radio-button>
          </el-radio-group-->
        </div>

        <div id="pc-content-view" v-if="editMode === 'view'">
          <text-editor v-if="postLang === '0'" :text.sync="postData.content" @update="textUpdate"></text-editor>
          <text-editor v-if="postLang === '1'" :text.sync="postData.content_sublang" @update="textUpdate"></text-editor>
        </div>

        <div id="pc-content-view" v-if="editMode === 'source'">
          <el-input
            type="textarea"
            :rows="20"
            placeholder="Source code editor"
            v-if="postLang === '0'"
            v-model="postData.content">
          </el-input>
          <el-input
            type="textarea"
            :rows="20"
            placeholder="Source code editor"
            v-if="postLang === '1'"
            v-model="postData.content_sublang">
          </el-input>
        </div>
      </div>

      <div class="pc-b" id="pc-brief">
        <WSubTitle txt="Brief"></WSubTitle>
        <el-input
          type="textarea"
          :rows="5"
          placeholder="Brief (12 Char +)"
          v-if="postLang === '0'"
          v-model="postData.brief">
        </el-input>

        <el-input
          type="textarea"
          :rows="5"
          placeholder="文章简述"
          v-if="postLang === '1'"
          v-model="postData.brief_sublang">
        </el-input>
      </div>

      <div class="pc-b" id="pc-likes">
        <WSubTitle txt="Likes"></WSubTitle>
        <el-input
          type="number"
          :rows="5"
          placeholder="Number only"
          v-model="postData.ux_likes">
        </el-input>
      </div>

      <div class="pc-b" id="pc-visit">
        <WSubTitle txt="Views"></WSubTitle>
        <el-input
          type="number"
          :rows="5"
          placeholder="Number only"
          v-model="postData.ux_visit">
        </el-input>
      </div>


      <div class="pc-ti" id="pc-ti">
        <WSubTitle txt="Title_img"></WSubTitle>

        <div class="pc-ti-img-cont">

          <span v-if="postData.title_img == null" v-on:click="uploadTitleImg">+ Add Title Image</span>

          <el-image
            v-if="postData.title_img != null"
            class="tableImage"
            :style="'width: 400px; height: 160px'"
            :src="postData.title_img"
            fit="contain"
            :preview-src-list="[postData.title_img]"
            lazy>

            <div slot="placeholder" class="au_img_placeholder">
                <span>Loading</span>
            </div>

          </el-image>

          <el-button v-if="postData.title_img != null" type="text" class="pc-ti-img-btn" v-on:click="uploadTitleImg">Change</el-button>
        </div>

        
      </div>
    </div>


    <div class="pc-b" id="pc-cate">
      <WSubTitle txt="Category"></WSubTitle>
      <el-select v-model="postData.cateId" placeholder="Category" v-if="cateLoaded">
        <el-option
          v-for="item in postCateOptions"
          :key="item.id"
          :label="item.cname + ' · ' + item.cname_sublang"
          :value="item.id">
        </el-option>
      </el-select>
    </div>

    
    <div class="pc-b" id="pc-status">
      <WSubTitle txt="Action"></WSubTitle>
      <el-select v-model="postData.status" placeholder="Action">
        <el-option
          v-for="item in postStatusOptions"
          :key="item.sid"
          :label="item.sname"
          :value="item.sid">
        </el-option>
      </el-select>
    </div>
    

    <div class="pc-b" id="pc-submit">
      <el-button type="primary" @click="submit()">Save</el-button>
      <el-button type="text" size="small" style="color:#FF5C5C;" @click="del()" v-if="mode === 'update'">Delete</el-button>
    </div>


    <upload-window v-if="upload_win" @uploaded="uploadHandler" @close="closeUpWin" :allowUrl="true" :allowSelect="true"></upload-window>
    
  </div>
</template>

<script>

import { EventBus } from '../../bus.js'
import { limitLength, isEmpty, getCookie, encodeRichText, decodeRichText } from '../../utils.js'
import uploadWindow from '../widgets/w_upload.vue'

import TextEditor from '../texteditor/index.vue'

import WTitle from '../widgets/w_title.vue'
import WSubTitle from '../widgets/w_subtitle.vue'


export default {
  name: "postsingle",
  components: {
    WTitle,
    WSubTitle,
    TextEditor,
    uploadWindow
  },

  props:{
    pid: String,
  },

  data () {
    return{
      // APIs
      base_url: "https://api.isjeff.com/pot",
      api: "https://api.isjeff.com/pot/data/post_single/?pid=",
      api_cate: "https://api.isjeff.com/pot/data/cate/",
      api_up_assets:"/",
      api_d_cate:"",
      api_up:"https://api.isjeff.com/pot/updater/post_single/",
      api_del: "https://api.isjeff.com/pot/updater/post_del/",

      // Upload Window
      upload_win: false,

      // Main Info
      mode: "update",
      postData: {
        title: "",
        title_sublang: "",
        title_img: "",
        content: "",
        content_sublang: "",
        cateId: "1",
        brief: "",
        brief_sublang: "",
        ux_likes:"",
        ux_visit:"",
        status: 0,
      },
      postCate: "",
      postLang: "0", // 0: First lang, second++
      postStatus: 0,

      // Options Info
      postCateOptions: [], // Storage all category, keep updated
      postStatusOptions:[
        {sid: 0, sname: "Draft"},
        {sid: 1, sname: "Publish"},
        {sid: 2, sname: "Deprecated"},
      ],

      // Edit Mode
      editMode: "view",

      // Loading Status
      loaded: false,
      cateLoaded: false,

      // Display Gate
      contOpen: true,

      // Loading status
      upLoading: false,
      
    }
  },

  http: {
    emulateJSON: true,
    emulateHTTP: true
  },

  created () {

    var that = this

    // Check if is new page
    if(this.pid == "new"){

      // Set Submit Mode
      this.mode = "new"
      this.loaded = true

    } else {

      // Set Submit Mode
      this.mode = "update"
      this.loaded = false

      // Get Data
      this.$nextTick(() => {
        this.getData()
      })
      
    }

    // Get Category
    this.$nextTick(()=>{
      this.getCate()
    })
        
    EventBus.$on("closeUpWin", function(data){
        that.upload_win = false
    })

    EventBus.$on("upWinRes", function(data){
        
    })
    
  },
  watch: {
    // Language Switcher
    postLang: function () {
      if(!this.loaded){
        return
      }
      
      // Refresh Container
      this.$nextTick(()=>{
        this.updateCont()
      })
    },
  },
  
  
  methods: {

    uploadHandler (data) {

      if(data.type.type === "Image"){

        this.setTitleImg(data.path)

      } else {

        this.$notify({
            title: 'Title image must be an image',
            message: 'Please check if you uploaded an image file',
            type: 'warning'
        })
        
      }
    },

    goBack() {
      EventBus.$emit('toPage', './postslist')
    },

    getData () {
      this.upLoading = true
      this.axios.get(this.api + this.pid).then((response) => {
        var res = response.data[0]
        res.content = decodeRichText(res.content)
        res.content_sublang = decodeRichText(res.content_sublang)
        res.status = Number(res.status)

        this.postData = res

        this.$nextTick(()=>{
          this.loaded = true
          this.upLoading = false
        })
      })
    },

    getCate () {
      this.axios.get(this.api_cate).then((response)=>{
        
        this.postCateOptions = response.data

        if(this.postCate === ""){

        }

        this.$nextTick(()=>{
          this.cateLoaded = true
        })
      })
    },

    

    textUpdate (data) {
      if(this.postLang === "0") {
        this.postData.content = data
      } else {
        this.postData.content_sublang = data
      }
    },

    updateCont(){
      this.contOpen = false
      this.$nextTick(() => {
        this.contOpen = true
      })
    },

    updateAll () {

      if(this.mode === "new") {
        EventBus.$emit('toPage', './postslist')
        return
      }

      // Get Post Single Data
      this.getData()

      // Get Category
      this.$nextTick(() => {
        this.getCate()
      })
      
      // Refresh Container
      this.$nextTick(() => {
        this.updateCont()
      })
    },

    submit () {

      this.upLoading = true

      var that = this

      var today = new Date().toISOString().slice(0, 19).replace('T', ' ')

      // Check mandatory content is not empty and did not excess certain words count
      if(
        isEmpty(this.postData.title) ||
        isEmpty(this.postData.content) ||
        limitLength("<", this.postData.title, 4) ||
        limitLength("<", this.postData.brief, 12)
      ){
        this.$notify({
            title: 'Check Needed',
            message: 'Please check your title or contents is not empty and meet text count requirement',
            type: 'warning'
        })
        this.upLoading = false
        return
      }

      if(this.postData.ux_likes > this.postData.ux_visit){
        this.$notify({
            title: 'Not Possible',
            message: 'Likes count should not larger than views count',
            type: 'warning'
        })
        this.upLoading = false
        return
      }


      var postReady = {
        mode: this.mode,
        ukey: getCookie('u_key'), 
        uuid: getCookie('u_uuid'), 
        pid: this.postData.id,
        cateId: this.postData.cateId,
        title: this.postData.title,
        title_sublang: this.postData.title_sublang,
        title_img: this.postData.title_img,
        content: encodeRichText(this.postData.content),
        content_sublang: encodeRichText(this.postData.content_sublang),
        brief: this.postData.brief,
        brief_sublang: this.postData.brief_sublang,
        date_pub: this.mode === "update" ? this.postData.data_pub  : today,
        date_modi: today,
        ux_visit: parseInt(this.postData.ux_visit),
        ux_likes: parseInt(this.postData.ux_likes),
        status: String(this.postData.status)
      }

      var postData = this.$qs.stringify(postReady)

      this.axios.post(this.api_up, postData)
      .then(function (response) {
        console.log(response.data)
          var res = response.data

          if(res.indexOf("success") != -1){

              that.$notify({
                  title: 'Submitted',
                  type: 'success'
              })

              that.updateAll()
              that.$nextTick(() => {
                EventBus.$emit('toPage', './postslist')
              })

          } else {
              that.$notify({
                  title: 'Submit Fail',
                  message: 'Error: ' + res,
                  type: 'warning'
              })
          }
          that.upLoading = false
      }).catch(function(err){
        that.upLoading = false
      })
    },

    del () {
      this.upLoading = true
      var that = this

      this.$confirm('You will delete a post permanently, continue?', 'Alert', {
        confirmButtonText: 'DELETE',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        
        var postReady = {
          ukey: getCookie('u_key'), 
          uuid: getCookie('u_uuid'), 
          pid: that.postData.id
        }

        var postData = this.$qs.stringify(postReady)

        that.axios.post(that.api_del, postData)
        .then(function (response) {

          var res = response.data

          if(res.indexOf("success") != -1){

              that.$notify({
                  title: 'Success',
                  message: 'Post has been removed',
                  type: 'success'
              })

              EventBus.$emit('toPage', './postslist')

          } else {
              that.$notify({
                  title: 'Fail',
                  message: 'Error: ' + res,
                  type: 'warning'
              })
          }

          that.upLoading = false
        })

      }).catch(() => {
        that.upLoading = false
        this.$message({
          type: 'info',
          message: 'Canceled'
        });          
      })
    },

    uploadTitleImg () {
      this.upload_win = true
    },

    closeUpWin () {
      this.upload_win = false
    },

    setTitleImg (url) {
      this.postData.title_img = url
    }


  }
  
}
</script>

<style scoped>

#all {
  margin: 24px;
}

#post-title{
  display:flex;
}

.pc-b{
  margin-top:24px;
}

.pc-ti{
  margin-top:24px;
}

.pc-ti-img-cont{
  width:400px;
  padding:12px;
  border: 1px dashed rgba(0,0,0,0.1);
  cursor: pointer;
}

.pc-ti-img-cont span{
  opacity: 0.5;
}

.pc-ti-img-btn{
  margin-top:6px;
  width:100%;
}

#post-lang-selector{
  right: 40px;
  position: absolute;
}

#pc-editmode-selector{
  margin-bottom: -16px;
}

#pc-editmode-selector .el-radio-group .el-radio-button span{
  font-size:12px;
}

</style>