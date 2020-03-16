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

        <el-form-item el-form-item label="Tencent COS">
          <el-switch
            v-model="form.tp_cos_enable"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <div v-if="form.tp_cos_enable">

          <el-form-item label="COS Bucket">
              <el-input v-model="form.tp_cos_bucket"></el-input>
          </el-form-item>

          <el-form-item label="COS Region">
              <el-input v-model="form.tp_cos_region"></el-input>
          </el-form-item>

          <el-form-item label="COS Key">
              <el-input v-model="form.tp_cos_key"></el-input>
          </el-form-item>

          <el-form-item label="COS Id">
              <el-input v-model="form.tp_cos_id"></el-input>
          </el-form-item>

        </div>

        

        <el-form-item label="Cookie Notice">
          <el-switch
            v-model="form.isCookieNotice"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item label="Site Logo">
            <el-image
                class="file-single-img-img"
                style="width: 180px; height: 180px"
                :src="form.siteLogo"
                fit="contain"
                :preview-src-list="[form.siteLogo]">

                <div slot="placeholder" class="au_img_placeholder">
                    <span>Loading</span>
                </div>

            </el-image>
            <br>
            <el-button @click="upSiteLogo">Upload</el-button>
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

    <upload-window 
      v-if="upload_win" 
      @uploaded="uploadHandler" 
      @close="closeUpWin" 
      :base="base"
      :allowUrl="false" 
      :allowSelect="true">
    </upload-window>
    
  </div>
</template>

<script>
import { encGet, genUpdate } from '../../request'
import { encodeRichText, decodeRichText, isEmpty, saveGlobalStatus } from '../../utils'
import WTitle from '../widgets/w_title.vue'
import WSubTitle from '../widgets/w_subtitle.vue'
import uploadWindow from '../widgets/w_upload'

export default {
  name: "postlist",
  components:{
    WTitle,
    WSubTitle,
    uploadWindow
  },
  props:{
    base: String
  },
  data(){
    return{
      api: "/data_enc/basic_enc/",
      api_up:"/updater/basic/",
      form:{},
      keywords:[],
      inputVisible: false,
      inputValue: '',
      upLoading: false,
      mode: 'normal',
      upload_win: false,
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

    getData () {
      this.upLoading = true
      var that = this

      encGet(this.base + this.api, {}, (res)=>{


        if(res.status){
          var finalRes = res.data[0]

          // Decode '' and ""
          finalRes.title = decodeRichText(finalRes.title)
          finalRes.subtitle = decodeRichText(finalRes.subtitle)
          finalRes.desText = decodeRichText(finalRes.desText)
          finalRes.seoTitle = decodeRichText(finalRes.seoTitle)
          finalRes.tp_cos_enable = finalRes.tp_cos_enable == 1 ? true : false
          finalRes.isCookieNotice = finalRes.isCookieNotice === "true" ? true : false

          that.form = finalRes
          // Decode keywords
          that.keywords = finalRes.keywords.split(',')

          saveGlobalStatus([
            {name: "poster_cos_enable", value: finalRes.tp_cos_enable},
            {name: "poster_cos_bucket", value: finalRes.tp_cos_bucket},
            {name: "poster_cos_region", value: finalRes.tp_cos_region}
          ])
          
        }
        that.upLoading = false
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
        keywords: this.keywords.join(),
      }
      
      this.upData(postReady)
      this.closeTagInput()

    },

    uploadHandler (d) {
      var data = d.data
        if(data.type.type === "Image"){

            this.form.siteLogo = data.path

        } else {

            this.$notify({
                title: 'Site Logo must be an image',
                type: 'warning'
            })
        
        }
    },

    upSiteLogo () {
      this.upload_win = true
    },

    closeUpWin () {
        this.upload_win = false
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

      if(this.form.tp_cos_enable){
        if(
          isEmpty(this.form.tp_cos_key) ||
          isEmpty(this.form.tp_cos_id) ||
          isEmpty(this.form.tp_cos_bucket) ||
          isEmpty(this.form.tp_cos_region)
        ){
          this.$notify({
            title: 'Check Needed',
            message: 'You need key, token, bucket and region for enabling COS',
            type: 'warning'
          })
          return
        }
      }

      this.mode = "normal"

      var postReady = {
        mode: this.mode,
        title: encodeRichText(this.form.title),
        subtitle: encodeRichText(this.form.subtitle),
        siteLogo: this.form.siteLogo,
        desText: encodeRichText(this.form.desText),
        baseUrl: this.form.baseUrl,
        seoTitle: encodeRichText(this.form.seoTitle),
        tp_cos_enable: this.form.tp_cos_enable ? 1 : 0,
        tp_cos_key: this.form.tp_cos_key ? this.form.tp_cos_key : "",
        tp_cos_id: this.form.tp_cos_id ? this.form.tp_cos_id : "",
        tp_cos_bucket: this.form.tp_cos_bucket ? this.form.tp_cos_bucket : "",
        tp_cos_region: this.form.tp_cos_region ? this.form.tp_cos_region : "",
        isCookieNotice: this.form.isCookieNotice
      }

      this.upData(postReady)

      this.closeTagInput()

    },

    upData (obj) {

      var that = this

      this.upLoading = true

      genUpdate(this.base + this.api_up, obj, (res)=>{
        if(res.status){
          that.$notify({
              title: 'Submitted',
              type: 'success'
          })

          that.getData()
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

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
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