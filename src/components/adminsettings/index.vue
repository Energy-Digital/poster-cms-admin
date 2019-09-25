<template>
  <div id="all">

    <WTitle txt="Master Account"></WTitle>

    <WSubTitle txt="Settings"></WSubTitle>

    <el-form ref="form" class="form" :model="form" label-width="120px" v-loading="upLoading">

        <el-form-item label="Name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Email">
            <el-input v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="Avatar">
            <el-image
                class="file-single-img-img"
                style="width: 180px; height: 180px"
                :src="form.avatar"
                fit="contain"
                :preview-src-list="[form.avatar]">

                <div slot="placeholder" class="au_img_placeholder">
                    <span>Loading</span>
                </div>

            </el-image>
            <br>
            <el-button @click="upAvatar">Upload</el-button>
        </el-form-item>

        <el-form-item label="PIN">
            <el-input v-model="form.pin" type="password"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submit">Save</el-button>
        </el-form-item>
    </el-form>

    <upload-window v-if="upload_win" @uploaded="uploadHandler" @close="closeUpWin" :allowUrl="true" :allowSelect="true"></upload-window>
    
  </div>
</template>

<script>
import { EventBus } from '../../bus'
import { getCookie, isEmpty } from '../../utils'
import uploadWindow from '../widgets/w_upload'
import WTitle from '../widgets/w_title.vue'
import WSubTitle from '../widgets/w_subtitle.vue'

export default {
  name: "adminsettings",
  components:{
    WTitle,
    WSubTitle,
    uploadWindow
  },
  props:{
    
  },
  data(){
    return{
      api: "https://api.isjeff.com/pot/data_enc/user_enc/",
      api_up:"https://api.isjeff.com/pot/updater/user_up/",
      form:{},
      keywords:[],
      upLoading: false,
      admUserId: '1',
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

    getData (page) {
      this.upLoading = true
      var that = this

      var postReady = {
        userId: getCookie('u_uuid'),
        ukey: getCookie('u_key'), 
        uuid: getCookie('u_uuid')
      }

      var postData = this.$qs.stringify(postReady)

      this.axios.post(this.api, postData)
      .then(function (response) {
        
          that.form = response.data[0]
          that.upLoading = false
      })
    },

    upAvatar () {
        this.upload_win = true
    },

    closeUpWin () {
        this.upload_win = false
    },

    uploadHandler (data) {
        if(data.type.type === "Image"){

            this.form.avatar = data.path

        } else {

            this.$notify({
                title: 'Avatar (profile image) must be an image',
                type: 'warning'
            })
        
        }
    },

    submit () {

      // Check mandatory content is not empty and did not excess certain words count
      if(
        isEmpty(this.form.name) ||
        isEmpty(this.form.email) ||
        isEmpty(this.form.pin)
      ){
        this.$notify({
            title: 'Check Needed',
            message: 'Make sure your name, email, pin is not empty and meet text count requirement',
            type: 'warning'
        })
        return
      }

      var that = this

      this.mode = "normal"

      var postReady = {
        ukey: getCookie('u_key'), 
        uuid: getCookie('u_uuid'), 
        userId: getCookie('u_uuid'),
        name: this.form.name,
        email: this.form.email,
        avatar: this.form.avatar,
        pin: this.form.pin
      }

      this.upData(postReady)

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