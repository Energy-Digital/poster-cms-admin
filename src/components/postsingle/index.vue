<template>
  <div id="all">

    <WTitle txt="Edit Post"></WTitle>

    <div id="post-lang-selector">
      <el-radio-group v-model="postLang" style="margin-bottom: 30px;">
        <el-radio-button label="0">English</el-radio-button>
        <el-radio-button label="1">中文</el-radio-button>
      </el-radio-group>
    </div>

    <div id="post-cont" v-if="contOpen">
      
      <div id="pc-title">
        <el-input v-model="postTitle" placeholder="Article Title"></el-input>
      </div>

      <div id="pc-content">
        <text-editor v-if="loaded" :text.sync="postContent" @update="textUpdate"></text-editor>
      </div>
    </div>

    <!--el-select v-model="value" placeholder="文章分类">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select-->

    <div id="submit">
      <el-button class="primary" @click="submit()">SAVE</el-button>
    </div>
    
  </div>
</template>

<script>
// require styles
/*import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'*/


import TextEditor from '../texteditor/index.vue'
import WTitle from '../widgets/w_title.vue'

//import Editor from 'tt-vue-editor'

export default {
  name: "postsingle",
  components: {
    WTitle,
    TextEditor
  },
  props:{
    pid: String,
  },
  data () {
    return{
      api: "https://api.isjeff.com/pot/data/post_single/?pid=",
      api_up_assets:"/",
      api_d_cate:"",
      postData: "",
      postContent: "aaaa",
      postTitle: "bbbb",
      postLang: "0", //0: First lang, second++
      loaded: false,
      contOpen: true
    }
  },
  http: {
    emulateJSON: true,
    emulateHTTP: true
  },
  created () {
    this.getData()
  },
  watch: {
    // Language Switcher
    postLang: function () {

      if(!this.loaded){
        return
      }

      // Switch Data
      this.postTitle = this.postLang === "0" ? this.postData.title : this.postData.title_sublang
      this.postContent = this.postLang === "0" ? this.postData.content : this.postData.content_sublang
      

      // Refresh Container
      this.$nextTick(()=>{
        this.updateCont()
      })
      
    }
  },
  
  methods: {
    getData () {
      this.axios.get(this.api + this.pid).then((response) => {
        var res = response.data[0]
        res.content = this.parseRichText(res.content)
        res.content_sublang = this.parseRichText(res.content_sublang)
        this.postData = res

        this.postContent = this.postLang === "0" ? res.content : res.content_sublang
        this.postTitle = this.postLang === "0" ? res.title : res.title_sublang

        console.log(res.title_sublang)

        this.$nextTick(()=>{
          this.loaded = true
        })
      })
    },

    getCate () {

    },

    parseRichText (val) {
      var replaceall = require("replaceall")
      return replaceall('|*|', '"', val)
    },

    onEditorChange (data) {

    },

    textUpdate (data) {
      this.postContent = data
    },

    updateCont(){
      this.contOpen = false
      this.$nextTick(() => {
        this.contOpen = true
      })
    },

    submit () {
      console.log(this.postContent)
    }

  }
  
}
</script>

<style scoped>

#all{
  margin: 40px;
}

#pc-content{
  margin-top:24px;
}

</style>