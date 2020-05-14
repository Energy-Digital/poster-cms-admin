<template>
  <div id="all" v-loading="upLoading" v-if="loaded">

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

      <div class="pc-b" id="pc-content">
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
          <text-editor v-if="postLang === '0'" :base="base" :text.sync="postData.content" @update="textUpdate"></text-editor>
          <text-editor v-if="postLang === '1'" :base="base" :text.sync="postData.content_sublang" @update="textUpdate"></text-editor>
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

          <span v-if="postData.title_img == ''" v-on:click="uploadTitleImg">+ Add Title Image</span>

          <el-image
            v-if="postData.title_img"
            class="tableImage"
            :style="'width: 400px; height: 160px'"
            :src="readTitleImgURL(postData.title_img, 'str')"
            fit="contain"
            :preview-src-list="readTitleImgURL(postData.title_img, 'arr')"
            lazy>

            <div slot="placeholder" class="au_img_placeholder">
                <span>Loading</span>
            </div>

          </el-image>

          <el-button v-if="postData.title_img" type="text" class="pc-ti-img-btn" v-on:click="uploadTitleImg">Change</el-button>
        </div>

        
      </div>
    </div>

    <div class="pc-t" id="pc-t">
      <WSubTitle txt="Publish Date"></WSubTitle>
      <el-switch
          active-text="Overwrite"
          inactive-text="Auto"
          v-model="owDatePub"
          active-color="#13ce66"
          inactive-color="#ff4949">
      </el-switch>

      <br><br>

      <el-date-picker
        v-model="postData.date_pub"
        value-format="yyyy-MM-dd hh:mm:ss"
        type="datetime"
        placeholder="Choose a date"
        :clearable="false"
        :disabled="!owDatePub">
      </el-date-picker>

      <br><br>

      <WSubTitle txt="Modification Date"></WSubTitle>
      <el-switch
          active-text="Overwrite"
          inactive-text="Auto"
          v-model="owDateModi"
          active-color="#13ce66"
          inactive-color="#ff4949">
      </el-switch>

      <br><br>

      <el-date-picker
        v-model="postData.date_modi"
        value-format="yyyy-MM-dd hh:mm:ss"
        type="datetime"
        placeholder="Choose a date"
        :clearable="false"
        :disabled="!owDateModi">
      </el-date-picker>
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
      <el-button type="text" size="small" style="color:#FF5C5C;" @click="submit('del')" v-if="mode === 'update'">Delete</el-button>
    </div>


    <upload-window 
      v-if="upload_win" 
      @uploaded="uploadHandler" 
      @close="closeUpWin" 
      :base="base"
      :allowUrl="true" 
      :allowSelect="true" 
      :allowMultiple="false">
    </upload-window>
    
  </div>
</template>

<script>

import { genGet, genUpdate } from '../../request'
import { limitLength, isEmpty, getCookie, encodeRichText, decodeRichText, encodeImgSrc, decodeImgSrc } from '../../utils.js'
import uploadWindow from '../widgets/w_upload.vue'

import TextEditor from '../texteditor/index.vue'

import WSubTitle from '../widgets/w_subtitle.vue'


export default {
  name: "postsingle",
  components: {
    WSubTitle,
    TextEditor,
    uploadWindow
  },

  props:{
    base: String
  },

  data () {
    return{
      //PID
      pid: 1,

      // APIs
      api: "/data/post_single/",
      api_cate: "/data/cate/",
      api_up:"/updater/post_single/",

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
        date_pub: "0",
        date_modi: "0",
        ux_likes:"0",
        ux_visit:"0",
        status: 0,
        authorId: "",
      },
      postCate: "",
      postLang: "0", // 0: First lang, second++
      postStatus: 0,

      owDatePub: false,
      owDateModi: false,

      // Options Info
      postCateOptions: [], // Storage all category, keep updated
      postStatusOptions:[
        {sid: 0, sname: "Draft"},
        {sid: 1, sname: "Publish"},
        {sid: 3, sname: "P & Unlisted"},
        {sid: 2, sname: "Deprecated"}
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
    this.pid = this.$route.query.pid ? this.$route.query.pid : "new"
     

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

    uploadHandler (d) {

      var data = d.data

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
      this.$router.push({ path: './postslist'})
    },

    getData () {
      var that = this
      this.upLoading = true

      genGet(this.base + this.api, [{name:"pid", val: this.pid}], (res)=>{
        if(res.status){
          var finalRes = res.data[0]
          finalRes.content = decodeRichText(finalRes.content)
          finalRes.content_sublang = decodeRichText(finalRes.content_sublang)
          finalRes.content = decodeImgSrc(finalRes.content, that.base)
          finalRes.content_sublang = decodeImgSrc(finalRes.content_sublang, that.base)
          finalRes.status = Number(finalRes.status)

          that.postData = finalRes
          that.$nextTick(()=>{
            that.loaded = true
            that.upLoading = false
          })
        }
      })

    },

    getCate () {
      var that = this
      genGet(this.base + this.api_cate, [], (res)=>{
        if(res.status){
          that.postCateOptions = res.data

          that.$nextTick(()=>{
            that.cateLoaded = true
          })
        }
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
        this.goBack()
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

    submit (mode) {
      var that = this

      var today = new Date().toISOString().slice(0, 19).replace('T', ' ')

      // Check mandatory content is not empty and did not excess certain words count
      if(
        isEmpty(this.postData.title) ||
        isEmpty(this.postData.content) ||
        limitLength("<", this.postData.title, 4)
      ){
        this.$notify({
            title: 'Check Needed',
            message: 'Please check your title or contents is not empty and meet text count requirement',
            type: 'warning'
        })
        this.upLoading = false
        return
      }

      this.upLoading = true
      var contentReady = encodeImgSrc(this.postData.content, this.base)
      contentReady = encodeRichText(contentReady)

      var contentSbReady = encodeImgSrc(this.postData.content_sublang, this.base)
      contentSbReady = encodeRichText(contentSbReady)

      var postReady = {
        mode: mode ? mode : this.mode,
        pid: this.postData.id,
        cateId: this.postData.cateId,
        title: this.postData.title,
        title_sublang: this.postData.title_sublang,
        title_img: this.postData.title_img,
        content: contentReady,
        content_sublang: contentSbReady,
        brief: this.postData.brief,
        brief_sublang: this.postData.brief_sublang,
        date_pub: this.mode === "update" ? this.postData.date_pub : today,
        date_modi: today,
        ux_visit: parseInt(this.postData.ux_visit),
        ux_likes: parseInt(this.postData.ux_likes),
        listOrder: parseInt(this.postData.listOrder),
        authorId: getCookie('u_uuid'),
        status: String(this.postData.status)
      }

      if(this.owDatePub){
        postReady.date_pub = this.postData.date_pub
      }

      if(this.owDateModi){
        postReady.date_modi = this.postData.date_modi
      }
      genUpdate(this.base + this.api_up, postReady, (res)=>{
        if(res.status){
          that.$notify({
              title: 'Success',
              type: 'success'
          })

          that.updateAll()
          that.$nextTick(() => {
            that.goBack()
          })
        } else {
          that.$notify({
              title: 'Submit Fail',
              message: 'Error: ' + res.error,
              type: 'warning'
          })
        }

        that.upLoading = false
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
    },

    readTitleImgURL(url, type){

      let res = url.indexOf('cos') != -1 ? 'https://' + url : this.base + url
      if(type == 'str'){
        return res
      }

      if(type == 'arr'){
        return [res]
      }
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

.pc-t{
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