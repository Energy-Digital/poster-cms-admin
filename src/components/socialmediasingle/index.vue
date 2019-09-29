<template>
    <div id="all" v-loading="upLoading">
        <div id="title">
            <el-page-header @back="goBack" title="Back" content="Edit Social Media"></el-page-header>
            <!--WTitle txt="Edit Category"></WTitle-->
        </div>
        
        <div id="form">
            <span>Name</span>
            <br>
            <div id="form-name">
                <el-input v-model="smData.name" placeholder="Please Input Name"></el-input>
            </div>
            <br>

            <span>URL</span>
            <br>
            <div id="form-url">
                <el-input v-model="smData.url" placeholder="Please Input URL"></el-input>
            </div>

            <span>Icon</span>
            <br>
            <div id="form-icon">
                <el-image
                    class="file-single-img-img"
                    style="width: 40px; height: 40px"
                    :src="smData.icon"
                    fit="contain">

                    <div slot="placeholder" class="au_img_placeholder">
                        <span>Loading</span>
                    </div>

                </el-image>
                <br>
                <el-button @click="upIcon">Upload</el-button>
            </div>

            <br>

            <div class="submit" id="submit">
                <el-button type="primary" @click="submit()">Save</el-button>
                <el-button type="text" size="small" style="color:#FF5C5C;" @click="del()" v-if="mode === 'update'">Delete</el-button>
            </div>
            
        </div>

        <upload-window v-if="upload_win" @uploaded="uploadHandler" @close="closeUpWin" :allowUrl="true" :allowSelect="true"></upload-window>

    </div>
</template>

<script>

// Import common js
import { EventBus }  from '../../bus.js'
import { isEmpty, getCookie } from '../../utils.js'

// Import widgets
import WTitle from '../widgets/w_title.vue'
import uploadWindow from '../widgets/w_upload.vue'


export default {
    name:"catesingle",
    props:{
        smId: {
            type: String,
            default: "1"
        }
    },
    components:{
        WTitle,
        uploadWindow
    },
    data(){
        return{
            api: "https://api.isjeff.com/pot/data/social_media/",
            api_up: "https://api.isjeff.com/pot/updater/social_media_single/",
            api_del: "https://api.isjeff.com/pot/updater/social_media_del/",
            smData: {
                name: "",
                url: "",
                icon: ""
            },
            mode: "update",
            upLoading: false,
            upload_win: false
        }
    },
    created(){

        if(this.smId === "new") {
            this.mode = "new"
        } else {
            this.getData()
        }
        
    },
    methods:{

        goBack() {
            EventBus.$emit('toPage', './socialmedialist')
        },

        getData(){
            this.upLoading = true
            this.axios.get(this.api+"?sid="+this.smId).then((response)=>{
                this.smData = response.data[0]
                this.upLoading = false
            })
        },

        submit() {
            var that = this

            // Check mandatory content is not empty and did not excess certain words count
            if(
                isEmpty(this.smData.name) ||
                isEmpty(this.smData.url)
            ){
                this.$notify({
                    title: 'Check Needed',
                    message: 'Please check your name or url is not empty',
                    type: 'warning'
                })
                return
            }

            this.upLoading = true

            var postReady = {
                mode: this.mode,
                ukey: getCookie('u_key'), 
                uuid: getCookie('u_uuid'), 
                smId: this.smId,
                name: this.smData.name,
                url: this.smData.url,
                icon: this.smData.icon,
            }

            var postData = this.$qs.stringify(postReady)

            this.axios.post(this.api_up, postData)
            .then(function (response) {

                var res = response.data

                if(res.indexOf("success") != -1){

                    that.$notify({
                        title: 'Submit Successful',
                        message: '',
                        type: 'success'
                    })

                    that.$nextTick(() => {
                        EventBus.$emit('toPage', './socialmedialist')
                    })

                } else {
                    that.$notify({
                        title: 'Fail',
                        message: 'Error: ' + res,
                        type: 'warning'
                    })
                }
                that.upLoading = false
            }).catch((err)=>{
                that.$notify({
                    title: 'Error: ' + err,
                    type: 'warning'
                })
                that.upLoading = false
            })
        },

        del () {

            var that = this

            var postReady = {
                ukey: getCookie('u_key'), 
                uuid: getCookie('u_uuid'), 
                smId: this.smId
            }

            var postData = this.$qs.stringify(postReady)

            this.axios.post(this.api_del, postData)
            .then(function (response) {

                var res = response.data

                if(res.indexOf("success") != -1){

                    that.$notify({
                        title: 'Deleted',
                        message: '',
                        type: 'success'
                    })

                    that.$nextTick(() => {
                        EventBus.$emit('toPage', './socialmedialist')
                    })

                } else {
                    that.$notify({
                        title: 'Delete Fail',
                        message: 'Error: ' + res,
                        type: 'warning'
                    })
                }
            })
        },

        upIcon () {
            this.upload_win = true
        },

        closeUpWin () {
            this.upload_win = false
        },

        uploadHandler (d) {
            var data = d.data
            if(data.type.type === "Image"){
                this.smData.icon = data.path
            } else {
                this.$notify({
                    title: 'Icon must be an image',
                    type: 'warning'
                })
            }
            
        }
    }
}
</script>

<style scoped>

#all {
    padding: 20px;
}

#title {
    margin-top:24px;
}

#lang {
    margin-top:24px;
}

#form {
    margin-top:24px;
}

#form-name {
    margin-top:24px;
}

#form-text {
    margin-top:24px;
}

#submit {
    margin-top:24px;
}
</style>