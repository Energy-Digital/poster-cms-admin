<template>
  <div id="all">

    <WTitle txt="All Posts"></WTitle>

    <div id="post-cont">
      <div id="pc-title">
        <el-input v-model="postData.title" placeholder="Article Title"></el-input>
      </div>

      <div id="pc-content">
        <text-editor v-if="loaded" :text.sync="postContent" @update="textUpdate"></text-editor>
      </div>
    </div>

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
      api: "https://api.isjeff.com/pot/data_posts_single.php?pid=",
      api_up_assets:"/",
      postData: "",
      postContent: "aaaa",
      postLang: 0, //0: First lang, second++
      loaded: false,
    }
  },
  http: {
    emulateJSON: true,
    emulateHTTP: true
  },
  created () {
    this.getData()
    console.log(this.pid)
  },
  
  methods: {
    getData () {
      this.axios.get(this.api + this.pid).then((response) => {
        var res = response.data[0]
        res.content = this.parseRichText(res.content)
        res.content_sublang = this.parseRichText(res.content_sublang)
        this.postData = res

        this.postContent = this.postLang == 0 ? res.content : res.content_sublang
        this.$nextTick(()=>{
          this.loaded = true
        })
      })
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