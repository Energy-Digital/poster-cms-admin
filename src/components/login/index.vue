<template>
    <div id="all">
        <div id="login-window">
            <el-input v-model="email" placeholder="Email Account"></el-input>
            <br>
            <el-input v-model="psw" placeholder="Verication Code" type="password"></el-input>
            <br>
            <el-button id="submitBtn" type="primary" v-on:click="submit">LOGIN</el-button>
        </div>
    </div>
</template>

<script>

import { EventBus } from '../../bus.js'
import { getCookie, setCookie } from '../../utils.js'

export default {
    name:"login",
    props: {

    },
    data () {
        return {
            api:"https://api.isjeff.com/pot/login/",
            email: "",
            psw: ""
        }
    },
    created () {
        if(getCookie('u_email')){
            this.email = getCookie('u_email')
        }
    },

    http: {
        emulateJSON: true,
        emulateHTTP: true
    },

    methods:{
        submit () {
            var that = this
            if(this.email.length > 0 && this.psw.length > 0) {

                // Initial API Token
                const key = "isjeffcomlogin";
                const key_encode =  window.btoa(key);

                var postReady = {email: this.email, psw: this.psw, token: key_encode}
                var postData = this.$qs.stringify(postReady)

                this.axios.post(this.api, postData)
                .then(function (response) {

                    var res = response.data

                    if(res.indexOf("success") != -1){

                        var sucInfo = res.split(',')

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
                        that.$notify({
                            title: 'Security Verfication Fail',
                            message: 'You can only try 10 times per day, be careful.',
                            type: 'warning'
                        })
                    }
                    

                })
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
</style>