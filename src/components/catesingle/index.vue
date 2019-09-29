<template>
    <div id="all" v-loading="upLoading">
        <div id="title">
            <el-page-header @back="goBack" title="Back" content="Edit Category"></el-page-header>
            <!--WTitle txt="Edit Category"></WTitle-->
        </div>

        <div id="lang">
            <el-radio-group v-model="postLang" style="margin-bottom: 30px;">
                <el-radio-button label="0">English</el-radio-button>
                <el-radio-button label="1">中文</el-radio-button>
            </el-radio-group>
        </div>
        
        <div id="form">
            <span v-if="postLang === '0'">Category Name</span>
            <span v-if="postLang === '1'">分类名称</span>
            <br>
            <div id="form-name">
                <el-input v-model="cateData.cname" placeholder="Please Input Name" v-if="postLang === '0'"></el-input>
                <el-input v-model="cateData.cname_sublang" placeholder="请输入分类名称" v-if="postLang === '1'"></el-input>
            </div>
            <br>

            <span v-if="postLang === '0'">Category Description</span>
            <span v-if="postLang === '1'">分类描述</span>
            <br>

            <div id="form-text">
                <el-input
                    type="textarea"
                    :rows="3"
                    v-if="postLang === '0'"
                    placeholder="Please Input Description"
                    v-model="cateData.des">
                </el-input>

                <el-input
                    type="textarea"
                    :rows="3"
                    v-if="postLang === '1'"
                    placeholder="请输入分类描述"
                    v-model="cateData.des_sublang">
                </el-input>
            </div>
            
            <br>

            <div class="submit" id="submit">
                <el-button type="primary" @click="submit()">Save</el-button>
                <el-button type="text" size="small" style="color:#FF5C5C;" @click="del()" v-if="mode === 'update'">Delete</el-button>
            </div>
            
            
            
        </div>

    </div>
</template>

<script>

// Import common js
import { EventBus }  from '../../bus.js'
import { genGet, genUpdate } from '../../request'
import { isEmpty, getCookie } from '../../utils.js'

export default {
    name:"catesingle",
    props:{
        cateId: {
            type: String,
            default: "1"
        }
    },
    components:{

    },
    data(){
        return{
            api: "https://api.isjeff.com/pot/data/cate/",
            api_up: "https://api.isjeff.com/pot/updater/cate_single/",
            api_del: "https://api.isjeff.com/pot/updater/cate_del/",
            cateData: {
                cname: "",
                cname_sublang: "",
                des: "",
                des_sublang: ""
            },
            postLang: "0",
            mode: "update",
            upLoading: false
        }
    },
    created(){

        if(this.cateId === "new") {
            this.mode = "new"
        } else {
            this.getData()
        }
        
    },
    methods:{

        goBack() {
            EventBus.$emit('toPage', './cateslist')
        },

        getData(){
            var that = this
            this.upLoading = true

            genGet(this.api, [
                {name: "cid", val: this.cateId}
            ], (res)=>{
                if(res.status){
                    that.cateData = res.data[0]
                }
                that.upLoading = false
            })
        },

        submit() {
            var that = this

            // Check mandatory content is not empty and did not excess certain words count
            if(
                isEmpty(this.cateData.cname) ||
                isEmpty(this.cateData.des)
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
                cid: this.cateId,
                cname: this.cateData.cname,
                cname_sublang: this.cateData.cname_sublang,
                des: this.cateData.des,
                des_sublang: this.cateData.des_sublang
            }

            genUpdate(this.api_up, postReady, (res)=>{
                if(res.status){

                    that.$notify({
                        title: 'Submit Successful',
                        message: '',
                        type: 'success'
                    })

                    that.$nextTick(() => {
                        EventBus.$emit('toPage', './cateslist')
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

        },

        del () {

            var that = this

            this.$confirm('This action will delete an category whether any posts are using, continue?', 'Alert', {
                confirmButtonText: 'DELETE',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                var postReady = {
                    cid: this.cateId
                }

                genUpdate(that.api_del, postReady, (res)=>{
                    if(res.status){
                        that.$notify({
                            title: 'Deleted',
                            message: '',
                            type: 'success'
                        })

                        that.$nextTick(() => {
                            EventBus.$emit('toPage', './cateslist')
                        })
                    } else {
                        that.$notify({
                            title: 'Delete Fail',
                            message: 'Error: ' + res,
                            type: 'warning'
                        })
                    }
                })



                // Continue doing other things..
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Cancelled'
                }) 

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