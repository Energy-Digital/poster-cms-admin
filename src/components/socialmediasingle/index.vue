<template>
    <div id="all" v-loading="upLoading">
        <div id="title">
            <el-page-header @back="goBack" title="Back" content="Edit Social Media"></el-page-header>
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
                    :src="base + smData.icon"
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
                <el-button type="text" size="small" style="color:#FF5C5C;" @click="submit('del')" v-if="mode === 'update'">Delete</el-button>
            </div>
            
        </div>

        <upload-window 
        v-if="upload_win" 
        @uploaded="uploadHandler" 
        @close="closeUpWin" 
        :base="base"
        :allowUrl="false" 
        :allowSelect="true"></upload-window>

    </div>
</template>

<script>

// Import common js
import { genGet, genUpdate } from '../../request'
import { isEmpty } from '../../utils.js'

// Import widgets
import uploadWindow from '../widgets/w_upload.vue'


export default {
    name:"socialmediasingle",
    props:{
        base: String,
    },
    components:{
        uploadWindow
    },
    data(){
        return{
            api: "/data/social_media/",
            api_up: "/updater/social_media_single/",
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

        this.smId = this.$route.query.smId

        if(this.smId === "new") {
            this.mode = "new"
        } else {
            this.getData()
        }
        
    },
    methods:{

        goBack() {
            this.$router.push({ path: './socialmedialist' })
        },

        getData(){
            var that = this
            this.upLoading = true

            genGet(this.base + this.api, [{name:"sid", val: this.smId}], (res)=>{
                if(res.status){
                    that.smData = res.data[0]
                }
                
                that.upLoading = false
            })
        },

        submit(mode) {
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
                mode: mode ? mode : this.mode,
                smId: this.smId,
                name: this.smData.name,
                url: this.smData.url,
                icon: this.smData.icon
            }

            genUpdate(this.base + this.api_up, postReady, (res)=>{
                if(res.status){
                     that.$notify({
                        title: 'Success',
                        message: '',
                        type: 'success'
                    })

                    that.$nextTick(() => {
                        that.goBack()
                    })
                } else{
                    that.$notify({
                        title: 'Fail',
                        message: 'Error: ' + res.error,
                        type: 'warning'
                    })
                }
                that.upLoading = false
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