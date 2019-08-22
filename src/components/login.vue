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
                const key = "txmedicalworld";
                const key_encode =  window.btoa(key);

                var postReady = {email: this.email, psw: this.psw, token: key_encode}
                var postData = this.$qs.stringify(postReady)

                this.axios.post(this.api, postData)
                .then(function (response) {

                    var res = response.data

                    if(res.indexOf("success") != -1){

                        var sucInfo = res.split(',')

                        that.clearCookie()

                        that.setCookie('u_key',sucInfo[1], 30, false) // Set Key
                        that.setCookie('u_uuid',sucInfo[2], 30, false) // Set UUID
                        that.setCookie('u_email',that.email, 30, false) // Set UEmail
                        
                        that.$notify({
                            title: '验证成功',
                            message: '已完成验证，返回成功',
                            type: 'success'
                        })
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

        setCookie (name, value, expDays, remove) {
            var exp, expTime
            
            if(!remove){
                expTime = (((60 * 1000)*60)*24)*expDays // 30 days
                exp = new Date()
                exp.setTime(exp.getTime() + expTime)
                document.cookie = name + "=" + value + ";" + "expires=" + exp.toGMTString()+";"
            } else {
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            }
            
        },

        clearCookie () {
            this.setCookie('u_key', 0, 30, true) // Set Key
            this.setCookie('u_uuid', 0, 30, true) // Set UUID
            this.setCookie('u_email', 0, 30, true) // Set UEmail
        }
    }
}
</script>

<style scoped>

</style>