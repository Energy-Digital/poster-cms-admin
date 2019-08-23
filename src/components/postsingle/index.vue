<template>
  <div id="all">

    <div id="title">
      <a>All Posts</a>
    </div>

    <div id="post-cont">
      <div id="pc-title">
        <el-input v-model="postData.title" placeholder="Article Title"></el-input>
      </div>

      <div id="pc-content">
        <quill-editor 
          :content="postData.content"
          :options="editorOption"
          @change="onEditorChange($event)">
        </quill-editor>
      </div>
    </div>
  </div>
</template>

<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: "postsingle",
  components: {
    quillEditor
  },
  props:{
    pid: String,
  },
  data () {
    return{
      api: "https://api.isjeff.com/pot/data_posts_single.php?pid=",
      postData: "",
      editorOption: { /* quill options */ }

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
  mounted() {
    console.log('Editor Ref: ', this.quillEditor)
  },
  computed: {

  },
  methods: {
    getData () {
      this.axios.get(this.api + this.pid).then((response) => {
        var res = response.data[0]
        res.content = this.parseRichText(res.content)
        res.content_sublang = this.parseRichText(res.content_sublang)
        this.postData = res
      })
    },

    parseRichText (val) {
      var replaceall = require("replaceall")
      return replaceall('|*|', '"', val)
    },

    onEditorChange (data) {

    }

  }
  
}
</script>

<style scoped>

</style>