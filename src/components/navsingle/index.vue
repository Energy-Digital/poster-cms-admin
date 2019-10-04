<template>
    <div id="all" v-loading="upLoading">
        <div id="title">
            <el-page-header @back="goBack" title="Back" content="Edit Navigation"></el-page-header>
            <!--WTitle txt="Edit Category"></WTitle-->
        </div>

        <div id="lang">
            <el-radio-group v-model="postLang" style="margin-bottom: 30px;">
                <el-radio-button label="0">English</el-radio-button>
                <el-radio-button label="1">中文</el-radio-button>
            </el-radio-group>
        </div>
        
        <div id="form">
            <span v-if="postLang === '0'">Name</span>
            <span v-if="postLang === '1'">名称</span>
            <br>
            <div id="form-name">
                <el-input v-model="navData.name" placeholder="Please Name" v-if="postLang === '0'"></el-input>
                <el-input v-model="navData.name_sublang" placeholder="请输入名称" v-if="postLang === '1'"></el-input>
            </div>
            <br>

            <span v-if="postLang === '0'">URL</span>
            <span v-if="postLang === '1'">链接</span>
            <br>

           <div id="form-url">
                <el-input v-model="navData.url" placeholder="URL"></el-input>
            </div>
            
            <br>

            <div class="submit" id="submit">
                <el-button type="primary" @click="submit()">Save</el-button>
                <el-button type="text" size="small" style="color:#FF5C5C;" @click="submit('del')" v-if="mode === 'update'">Delete</el-button>
            </div>
            
            
            
        </div>

    </div>
</template>

<script>

// Import common js
import { genGet, genUpdate } from '../../request'
import { isEmpty, getCookie } from '../../utils.js'

export default {
    name:"catesingle",
    props:{
        base: String
    },
    components:{

    },
    data(){
        return{
            api: "/data/layout_nav/",
            api_up: "/updater/layout_nav/",
            navData: {
                name: "",
                name_sublang: "",
                url: "",
            },
            postLang: "0",
            mode: "update",
            upLoading: false
        }
    },
    created(){

        this.navId = this.$route.query.navId
        
        if(this.navId === "new") {
            this.mode = "new"
        } else {
            this.getData()
        }
        
    },
    methods:{

        goBack() {
            this.$router.push({ path: './navslist' })
        },

        getData(){
            var that = this
            this.upLoading = true

            genGet(this.base + this.api, [
                {name: "id", val: this.navId}
            ], (res)=>{
                if(res.status){
                    that.navData = res.data[0]
                }
                that.upLoading = false
            })
        },

        submit() {
            var that = this

            // Check mandatory content is not empty and did not excess certain words count
            if(
                isEmpty(this.navData.name) ||
                isEmpty(this.navData.url)
            ){
                this.$notify({
                    title: 'Check Needed',
                    message: 'Please check your name or description is not empty',
                    type: 'warning'
                })
                return
            }

            this.upLoading = true

            var postReady = {
                mode: this.mode,
                id: this.navId,
                name: this.navData.name,
                name_sublang: this.navData.name_sublang,
                url: this.navData.url,
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
                } else {
                    that.$notify({
                        title: 'Fail',
                        message: 'Error: ' + res.data,
                        type: 'warning'
                    })
                }

                that.upLoading = false
            })

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