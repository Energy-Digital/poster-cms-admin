<template>
  <div id="all" v-loading="upLoading">

    <WTitle txt="Theme Data Settings"></WTitle>

    <WSubTitle :txt="themeName"></WSubTitle>

    <br>

    <div class="type-image" v-for="(item, key, index) in themeData" :key="'I'+key+index">
        <div class="type-image-single" v-if="item.type === 'Image'">
            <div>{{key}}:</div>
            <el-image
                v-if="item.val != ''"
                class="file-single-img-img"
                style="width: 180px; height: 180px"
                :src="base + item.val"
                fit="contain"
                :preview-src-list="[base + item.val]">

                <div slot="placeholder" class="au_img_placeholder">
                    <span>Loading</span>
                </div>

            </el-image>
            <br>
            <br>
            <el-button @click="upFile(key)">Upload</el-button>
            <br>
            <br>
            
        </div>
    </div>

    <br>

    <div class="type-file" v-for="(item, key, index) in themeData" :key="'F'+key+index">
        <div class="type-file-single" v-if="item.type === 'File'">
            <div>{{key}}:</div>
            <el-input v-model="item.val"></el-input>
            <br><br>
            <el-button @click="upFile(key)">Upload</el-button>
            <br>
            <br>
            
        </div>
    </div>

    <br>

    <div class="type-text" v-for="(item, key, index) in themeData" :key="'T'+key+index">
        <div class="type-text-single" v-if="item.type === 'Text'">
            <div>{{key}}:</div>
            <el-input v-model="item.val"></el-input>
        </div>
        <br>
    </div>
    

    <el-button type="primary" v-on:click="submit">Save</el-button>

    <upload-window 
      v-if="upload_win" 
      @uploaded="uploadHandler" 
      @close="closeUpWin" 
      :base="base"
      :allowUrl="false" 
      :allowSelect="true" 
      :allowMultiple="false">
    </upload-window>
    
  </div>
</template>

<script>
import { EventBus } from '../../bus'
import { genGet, genUpdate } from '../../request'
import { getCookie, encodeRichText, decodeRichText, isEmpty } from '../../utils'
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
    base: String,
  },
  data(){
    return{
      api: "/data/themes/",
      api_up:"/updater/theme/",
      themeData: {},
      themeName: "",
      themeId: "",
      imageUploadTarget: "",
      upLoading: false,
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

      genGet(this.base + this.api, [{name: "active", val: "true"}], (res)=>{
        if(res.status){
            
            var finalRes = res.data.data[0]
            that.themeId = res.data.activeTheme
            that.themeName = finalRes.name
            that.themeData = JSON.parse(decodeRichText(finalRes.data_struct))
          
        }
        that.upLoading = false
      })

    },

    uploadHandler (d) {
        var data = d.data
        var target = this.imageUploadTarget
        this.themeData[target].val = data.path
    },

    upFile (key) {
        this.imageUploadTarget = key
        this.upload_win = true
    },

    closeUpWin () {
        this.imageUploadTarget = ""
        this.upload_win = false
    },

    submit () {

        var that = this 
        this.upLoading = true

        var postReady = {
            mode: "data",
            id: this.themeId,
            data_struct: encodeRichText(JSON.stringify(this.themeData)),
        }

        genUpdate(this.base + this.api_up, postReady, (res)=>{
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