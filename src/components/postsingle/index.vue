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
        <quill-editor :content="postData.content"
                :options="editorOption"
                @change="onEditorChange($event)">
        </quill-editor>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "postsingle",
  props:{
    pid: String
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
  },
  mounted() {
    console.log('this is current quill instance object', this.editor)
  },
  computed: {

  },
  methods: {
    getData () {
      this.axios.get(this.api + this.pid).then((response) => {
        var res = response.data[0]
        res.content = this.parseRichHTML(res.content)
        res.content_sublang = this.parseRichHTML(res.content_sublang)
        console.log(res.content)
        this.postData = res
      })
    },

    parseRichHTML (val) {
      var replaceall = require("replaceall")
      return replaceall('|*|', '"', val)
    },

    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
    }
  }
  
}
</script>

<style scoped>

</style>