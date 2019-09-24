<template>
  <div id="all">

    <WTitle txt="Website Settings"></WTitle>

    <WSubTitle txt="Site Basic"></WSubTitle>

    <el-form ref="form" class="form" :model="form" label-width="120px" v-loading="upLoading">

        <el-form-item label="Title">
            <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="Subtitle">
            <el-input v-model="form.subtitle"></el-input>
        </el-form-item>

        <el-form-item label="Description">
            <el-input v-model="form.desText"></el-input>
        </el-form-item>

        <el-form-item label="SEO Name">
            <el-input v-model="form.seoTitle"></el-input>
        </el-form-item>

        
        <el-form-item label="URL">
            <el-input v-model="form.baseUrl"></el-input>
        </el-form-item>

        <el-form-item label="Cookie Notice">
          <el-switch
            v-model="form.isCookieNotice"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submit">Save</el-button>
        </el-form-item>
    </el-form>

    <div>
        <WSubTitle txt="SEO Keywords"></WSubTitle>
        <div class="keywords" v-loading="upLoading">
          <el-tag
              :key="tag"
              v-for="tag in keywords"
              closable
              :disable-transitions="false"
              @close="tagDel(tag)">
              {{tag}}
          </el-tag>
          <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="tagSubmit"
              @blur="tagSubmit"
              >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </div>
        
    </div>


    
  </div>
</template>

<script>
import { EventBus } from '../../bus'
import { getCookie, encodeRichText, decodeRichText, isEmpty } from '../../utils'
import WTitle from '../widgets/w_title.vue'
import WSubTitle from '../widgets/w_subtitle.vue'

export default {
  name: "postlist",
  components:{
    WTitle,
    WSubTitle
  },
  props:{
    
  },
  data(){
    return{
      api: "https://api.isjeff.com/pot/data/basic/",
      api_up:"https://api.isjeff.com/pot/updater/basic/",
      form:{},
      keywords:[],
      inputVisible: false,
      inputValue: '',
      upLoading: false,
      mode: 'normal'
    }
  },
  http: {
    emulateJSON: true,
    emulateHTTP: true
  },
  created(){
    this.getData()
  },
  methods:{

    getData (page) {
      this.upLoading = true
      var that = this

      this.axios.get(this.api).then((response) => {
        var res = response.data[0]
        // Decode '' and ""
        res.title = decodeRichText(res.title)
        res.subtitle = decodeRichText(res.subtitle)
        res.desText = decodeRichText(res.desText)
        res.seoTitle = decodeRichText(res.seoTitle)

        res.isCookieNotice = res.isCookieNotice === "true" ? true : false

        this.form = res
        // Decode keywords
        this.keywords = res.keywords.split(',')

        // Disable loading status
        this.upLoading = false
      })
    },

    tagSubmit () {

      if(this.inputValue.length < 1) {
        this.closeTagInput()
        return
      }

      if(this.checkArrDuplicate(this.inputValue, this.keywords)){
        this.keywords.push(this.inputValue)
      } else {
        this.closeTagInput()
        this.$notify({
            title: 'Tags Duplicated',
            type: 'warning'
        })
        return
      }

      this.mode = "keywords"
      var postReady = {
        mode: this.mode,
        ukey: getCookie('u_key'), 
        uuid: getCookie('u_uuid'), 
        keywords: this.keywords.join(),
      }

      this.upData(postReady)
      this.closeTagInput()
      
    },

    tagDel (data) {
      this.mode = "keywords"

      this.keywords.splice(this.keywords.indexOf(data), 1)

      var postReady = {
        mode: this.mode,
        ukey: getCookie('u_key'), 
        uuid: getCookie('u_uuid'), 
        keywords: this.keywords.join(),
      }
      
      this.upData(postReady)
      this.closeTagInput()

    },

    closeTagInput () {
      this.inputVisible = false
      this.inputValue = ''
    },

    checkArrDuplicate (target, arr) {
      for(var i=0;i<arr.length;i++){
        if(target === arr[i]){
          return false
        }
      }

      return true
    },

    submit () {

      // Check mandatory content is not empty and did not excess certain words count
      if(
        isEmpty(this.form.title) ||
        isEmpty(this.form.baseUrl)
      ){
        this.$notify({
            title: 'Check Needed',
            message: 'Please check your title or site url is not empty and meet text count requirement',
            type: 'warning'
        })
        return
      }

      var that = this

      this.mode = "normal"

      var postReady = {
        mode: this.mode,
        ukey: getCookie('u_key'), 
        uuid: getCookie('u_uuid'), 
        title: encodeRichText(this.form.title),
        subtitle: encodeRichText(this.form.subtitle),
        desText: encodeRichText(this.form.desText),
        baseUrl: this.form.baseUrl,
        seoTitle: encodeRichText(this.form.seoTitle),
        isCookieNotice: this.form.isCookieNotice
      }

      this.upData(postReady)

      this.closeTagInput()

    },

    upData (obj) {

      var that = this

      this.upLoading = true

      var postData = this.$qs.stringify(obj)

      this.axios.post(this.api_up, postData)
      .then(function (response) {

          var res = response.data
          

          if(res.indexOf("success") != -1){

              that.$notify({
                  title: 'Submitted',
                  type: 'success'
              })

              that.getData()

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

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

  }
}
</script>

<style scoped>
#all{
  text-align: left;
  padding:24px;
}

.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.form{
  margin-top:24px;
  width:50%;
}
</style>