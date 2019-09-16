<template>
    <div id="header-cont">
        <div id="header-content">
            <div id="header-left" v-on:click="toHome">
                <div id="header-title">
                    <span id="header-title-big">PROTFOLIO CONTROL PANEL</span>
                    <br>
                    <span id="header-title-sub">作品集管理控制面板</span>
                </div>
            </div>

            <div id="header-right">
                <div id="header-user">
                    <div id="header-user-avator">
                        <img src="../assets/avator.png" alt="">
                    </div>

                    <div id="header-user-name">
                        <span>{{username}}</span>
                    </div>

                    
                </div>
                <div id="header-logout">
                    <el-button v-on:click="logout" style="background:#222222;color:#ffffff;" plain>退出</el-button>
                </div>
            </div>

            
        </div>
    </div>
</template>

<script>
import { EventBus } from "../bus.js"
export default {
    name:"topping",
    props:{
        
    },
    data (){
        return {
            username: "Admin",
        }
    },
    created () {
        if(this.getCookie("u_name").length > 0){
            this.username = this.getCookie("u_name")
        }
    },
    methods:{
        handleOpen( data ){
            console.log(data)
            return
        },

        handleClose ( data ) {
            console.log(data)
            return
        },

        logout () {
            EventBus.$emit("logout", true)
        },

        toHome () {
            EventBus.$emit("toPage", '/home')
        },

        getCookie(cname){
            var name = cname + "="
            var ca = document.cookie.split(';')
            for(var i=0; i<ca.length; i++) 
            {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) return c.substring(name.length,c.length)
            }
            return ""
        },
    }
}
</script>


<style scoped>

#header-cont{
    width:100%;
    height:auto;
    background-color:#222222;
    overflow: hidden;
}

#header-content{
    padding-top:20px;
    padding-bottom:20px;
}

#header-left{
    position:absolute;
    left:20px;
    cursor: pointer;
}

#header-title{
    text-align: left;
}

#header-title span{
    color:#ffffff;
}

#header-title-big{
    font-size:18px;
    font-weight: bold;
}

#header-title-sub{
    font-size:16px;
    font-weight: normal;
}

#header-user{
    display:flex;
    margin-top:4px;
    margin-right: 18px;
}

#header-right{
    position:absolute;
    right:40px;
    display:flex;
}

#header-right span{
    color:#ffffff;
    font-size:16px;
}

#header-user-avator img{
    width:32px;
}

#header-user-name {
    margin-top:6px;
    margin-left:6px;
}

</style>

