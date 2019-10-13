<template>
    <div id="all">
        <div id="setup-cont">
            <div id="setup-inner">
                <div id="setup-title">
                    <span>Welcome, Poster Setup</span>
                </div>

                <div id="setup-subtitle">
                    <WSubTitle txt="Connect to your database"></WSubTitle>
                </div>

                <div id="setup-form">
                    <el-form ref="form" :model="form" label-width="80px">

                        <el-form-item label="Location">
                            <el-input v-model="form.url"></el-input>
                        </el-form-item>

                        <el-form-item label="Username">
                            <el-input v-model="form.user"></el-input>
                        </el-form-item>

                        <el-form-item label="Password">
                            <el-input v-model="form.psw"></el-input>
                        </el-form-item>

                        <el-form-item label="Table">
                            <el-input v-model="form.select"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="submit">Start Now</el-button>
                        </el-form-item>
                        

                    </el-form>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>

import WSubTitle from '../widgets/w_subtitle.vue'
import { genPost } from '../../request'
import { EventBus } from '../../bus'

export default {
    name: "setup",
    components:{
        WSubTitle
    },
    props:{
        base: String,
    },
    data(){
        return{
            api: "/setup/",
            form:{
                url: "",
                user: "",
                psw: "",
                select: ""
            }
        }
    },
    methods:{
        submit () {
            var postReady = {
                url: this.form.url,
                user: this.form.user,
                psw: this.form.psw,
                select: this.form.select
            }
            genPost(this.base + this.api, postReady, (res)=>{
                if(res.data.indexOf("success") != -1){
                    this.$notify({
                        title: 'Setup Successful',
                        type: 'success'
                    })
                    EventBus.$emit("setup-done", true)
                }
                
                else if(res.data.indexOf("wrong")){
                    this.$notify({
                        title: "Can't connect to this database",
                        type: 'warning'
                    })
                }
                
                else {
                    this.$notify({
                        title: 'Something when wrong',
                        type: 'warning'
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
#all{
    position:fixed;
    width:100%;
    height: 100%;
}

#setup-cont{
    width: 700px;
    height: 460px;
    background-color:#ffffff;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 4px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 8px 16px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.12);
}

#setup-inner{
    padding: 36px;
}

#setup-title{
    font-size:24px;
    font-weight: bold;
    margin-bottom: 30px;
}
</style>