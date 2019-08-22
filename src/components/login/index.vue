<template>
    <div id="all">
        <el-input v-model="email" placeholder="Email Account"></el-input>
        <br>
        <el-input v-model="psw" placeholder="Passcode" type="password"></el-input>
        <br>
        <el-button type="primary" v-on:click="submit">LOGIN</el-button>
    </div>
    
</template>

<script>

import { EventBus } from '../../bus.js'

export default {
    name:"login",
    props: {

    },
    data () {
        return {
            api:"https://api.isjeff.com/pot/login.php",
            email: "",
            psw: ""
        }
    },
    created () {
        if(this.getCookie('u_email')){
            this.email = this.getCookie('u_email')
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

                        EventBus.$emit("clearCookie", true)


                        EventBus.$emit("setCookie", {
                            name: "u_key",
                            value: sucInfo[1],
                            expDays: 30,
                            remove: false
                        })

                        EventBus.$emit("setCookie", {
                            name: "u_uuid",
                            value: sucInfo[2],
                            expDays: 30,
                            remove: false
                        })

                        EventBus.$emit("setCookie", {
                            name: "u_name",
                            value: sucInfo[3],
                            expDays: 30,
                            remove: false
                        })

                        EventBus.$emit("setCookie", {
                            name: "u_email",
                            value: that.email,
                            expDays: 30,
                            remove: false
                        })

                        that.$notify({
                            title: '验证成功',
                            message: '已完成验证，返回成功',
                            type: 'success'
                        })

                        EventBus.$emit('login', true)

                    } else {
                        that.$notify({
                            title: '验证失败',
                            message: '错误',
                            type: 'warning'
                        })
                    }
                    

                })

                
            }
        },

        getCookie (cname) {
            var name = cname + "="
            var ca = document.cookie.split(';')
            for(var i=0; i<ca.length; i++){
                var c = ca[i].trim()
                if (c.indexOf(name)==0) return c.substring(name.length,c.length)
            }
            return ""
        },
    }
}
</script>

<style scoped>

</style>