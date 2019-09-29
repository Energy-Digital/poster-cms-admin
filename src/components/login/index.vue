<template>
    <div id="all" v-loading="upLoading">
        <div>
            <img src="" alt="">
        </div>

        <div id="login-window" @mousemove="robotTest" @keyup.enter="submit">

            <el-tabs v-model="tab">
                <el-tab-pane label="PIN+Token" name="password"></el-tab-pane>
                <!--el-tab-pane label="Email" name="email"></el-tab-pane-->
                <el-tab-pane label="Mobile" name="mobile"></el-tab-pane>
            </el-tabs>

            <div id="login-inner-vcode" v-if="tab==='password'">
                <el-avatar :size="72" :src="avatar" v-if="loginTryAgain"></el-avatar>
                <br>
                <br>
                <el-input v-model="email" placeholder="Email"></el-input>
                <br>
                <el-input v-model="psw" placeholder="PIN+Token" type="password"></el-input>
                <br>
                <el-button id="submitBtn" type="primary" v-on:click="submit" :disabled="goBtn">GO</el-button>
            </div>

            <div id="login-inner-mobile" v-if="tab==='mobile'">
                <el-avatar :size="72" :src="avatar" v-if="loginTryAgain"></el-avatar>
                <br>
                <br>

                <div id="login-inner-mobilecode" class="login-inner-vcode">
                    <el-input v-model="phone" placeholder="Phone number"></el-input>
                    <el-button class="login-inner-vcode-btn" type="primary" v-on:click="getVcode('phone')" :disabled="getCodeBtn" plain>{{codeCountdown}}</el-button>
                </div>
                
                <br>

                <el-input v-model="psw" placeholder="code" type="password"></el-input>
                <br>
                <el-button id="submitBtn" type="primary" v-on:click="submit" :disabled="goBtn">GO</el-button>
            </div>
            
        </div>
    </div>
</template>

<script>

import { EventBus } from '../../bus.js'
import { loginRequest } from '../../request'
import { getCookie, setCookie } from '../../utils.js'

export default {
    name:"login",
    props: {

    },
    data () {
        return {
            api:"https://api.isjeff.com/pot/login/",
            api_mobile: "https://api.isjeff.com/pot/login/login_sms/",
            email: "",
            phone: "",
            psw: "",
            avatar: "",
            tab:"password",
            upLoading: false,
            goBtn: true,
            getCodeBtn: false,
            loginTryAgain: false,
            robotTestLastX: false,
            robotTestRes: false,
            codeSent: false,
            codeCountdown: "verify",
            codeGetTimeGap: 60
        }
    },
    created () {
        if(getCookie('u_email')){
            this.email = getCookie('u_email')
        }
    },

    watch: {
        tab: function () {
            this.goBtn = true
            this.psw = ""
            this.phone = ""
        },

        psw: function () {
            if(this.psw.length > 3){
                this.goBtn = false
            } else {
                this.goBtn = true
            }
        },

        codeCountdown: function () {
            if(this.codeCountdown === 0) {
                this.codeCountdown = "verify"
                this.getCodeBtn = false
                clearInterval()
            }
        }
    },


    http: {
        emulateJSON: true,
        emulateHTTP: true
    },

    methods:{

        
        submit () {
            this.upLoading = true
            var that = this

            if(!this.robotTestRes){
                this.$notify({
                    title: 'Looks like you are a robot, hhhhh.',
                    type: 'warning'
                })
                return
            }

            if(this.psw.length > 3) {

                if(this.tab === "password"){
                    if(this.email.length < 3){
                        that.$notify({
                            title: 'Email should more than 4 charcters.',
                            type: 'warning'
                        })
                        return
                    }
                } else {
                    if(this.phone.length < 9){
                        that.$notify({
                            title: 'Phone number should more than 10 charcters.',
                            type: 'warning'
                        })
                        return
                    }
                }

                var postReady = { email: this.email, psw: this.psw }

                var api = this.api
                 
                if(this.tab === "mobile"){
                    postReady['tel'] = this.phone
                    postReady['mode'] = "vsms"
                    api = this.api_mobile
                }

                loginRequest(api, postReady, (res)=>{
                    if(res.status){
                        if(res.data.indexOf('success') != -1){
                            var sucInfo = res.data.split(',')

                            that.clearLoginCookie()

                            setCookie("u_key", sucInfo[1], 30, false)
                            setCookie("u_uuid", sucInfo[2], 30, false)
                            setCookie("u_name", sucInfo[3], 30, false)
                            setCookie("u_avatar", sucInfo[4], 30, false)
                            setCookie("u_email", that.email, 30, false)

                            that.$notify({
                                title: 'Security Verfication Successful',
                                type: 'success'
                            })

                            EventBus.$emit('login', true)
                        } else {
                            var againInfo = res.data.split(',')
                            that.loginTryAgain = true
                            that.avatar = againInfo[1]
                            that.$notify({
                                title: 'Verfication Fail',
                                message: 'You can only try 10 times per day, be careful.',
                                type: 'warning'
                            })
                        }

                    } else {
                        that.$notify({
                            title: 'Unknow error',
                            message: 'Error: ' + res.error,
                            type: 'warning'
                        })
                    }
                })

            } else {
                that.$notify({
                    title: 'Email and password should more than 3 charcters.',
                    type: 'warning'
                })
            }
            this.upLoading = false
        },

        getVcode (m) {
            this.upLoading = true
            var that = this
            

            var postReady = {
                tel: this.phone, 
                mode:'sms'
            }

            loginRequest(this.api_mobile, postReady, (res)=>{
                if(res.status){
                    var finalRes = res.data
                    if(finalRes.result == 0){
                        that.codeSent = true
                        that.getCodeBtn = true
                        that.countDown()
                        that.$notify({
                            title: 'Code sent, check your inbox.',
                            type: 'success'
                        })

                    }

                    else if(finalRes.result == 1024 || finalRes.result == 1025){

                        that.$notify({
                            title: 'You can only verify 5 times pre hour, 10 times pre day. Wait or use PIN+Token.',
                            type: 'warning'
                        })

                    } 

                    else if(finalRes.indexOf("sent") != -1){

                        that.codeSent = true
                        that.getCodeBtn = true

                        that.countDown()

                        that.$notify({
                            title: 'Code sent, check your inbox.',
                            type: 'warning'
                        })

                    } 

                    else if (finalRes.indexOf("serr") != -1){
                        that.$notify({
                            title: 'Could not sent',
                            type: 'warning'
                        })
                    }
                    
                    else if(finalRes.indexOf("wait") != -1) {
                        
                        that.$notify({
                            title: 'Slow down. Wait 1 minute.',
                            type: 'warning'
                        })
                    }

                    else {
                        that.$notify({
                            title: 'Unknow Error: ' + res.data.result,
                            type: 'warning'
                        })
                    }
                        
                } else {
                    that.$notify({
                        title: 'Unknow Error: ' + res.error,
                        type: 'warning'
                    })
                }
            })
            this.upLoading = false
        },

        countDown(){
            var that = this
            that.codeCountdown = that.codeCountdown === "verify" ? this.codeGetTimeGap - 1 : that.codeCountdown
            setTimeout(function(){ 
                that.codeCountdown = that.codeCountdown - 1
                if(that.codeCountdown != 0){
                    that.countDown()
                }
            }, 1000)
        },

        robotTest (e) {

            if(!this.robotTestRes){

                if(this.robotTestLastX != false){
                    if(e.clientX != this.robotTestLastX + 3 || e.clientX != this.robotTestLastX - 3){
                        this.robotTestRes = true
                        return
                    }
                    
                } else {
                    this.robotTestLastX = e.clientX
                }
                
            }
        },

        clearLoginCookie () {
            setCookie('u_key', 0, 30, true)
            setCookie('u_uuid', 0, 30, true)
            setCookie('u_name', 0, 30, true)
            setCookie('u_avatar', 0, 30, true)
        }
    }
}
</script>

<style scoped>
#all{
    width:100%;
    margin-top:10%;
    text-align: center;
}

#login-window{
    width:25%;
    height:400px;
    text-align:center;
    margin-left: auto;
    margin-right: auto;
}

#login-window .el-input{
    margin-top:10px;
    margin-bottom:10px;
}

#submitBtn { 
    margin-top:40px;
}

.login-inner-vcode{
    display: flex;
}

.login-inner-vcode-btn{
    height: 40px;
    margin-top: 10px;
    margin-left: 10px;
}
</style>