<template>
    <div id="all">
        <el-input v-model="email" placeholder="Email Account"></el-input>
        <br>
        <el-input v-model="psw" placeholder="Passcode" type="number"></el-input>
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
                    console.log(res)

                    if(res.indexOf("success")){
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
        }
    }
}
</script>

<style scoped>

</style>