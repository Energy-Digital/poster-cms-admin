<template>
    <div id="header-cont">
        <div id="header-content">
            <div id="header-left" v-on:click="toHome">
                <div id="header-title">
                    <span id="header-title-sub">{{siteName}}</span>
                </div>
            </div>

            <div id="header-right">
                <div id="header-user" v-on:click="toAdmSet">
                    <div id="header-user-avatar">
                        <el-avatar :size="24" :src="base + avatar"></el-avatar>
                    </div>

                    <div id="header-user-name">
                        <span>{{username}}</span>
                    </div>

                    
                </div>
                <div id="header-logout">
                    <span v-on:click="logout">EXIT</span>
                </div>
            </div>

            
        </div>
    </div>
</template>

<script>
import { EventBus } from "../bus"
import { getCookie } from "../utils"
export default {
    name:"topping",
    props:{
        siteName: {
            type: String,
            default: "Rider"
        },
        base: String
    },
    data (){
        return {
            username: "",
            avatar: "",
        }
    },
    created () {
        if(this.getCookie("u_name").length > 0){
            this.username = getCookie("u_name")
            this.avatar = getCookie("u_avatar")
        }
    },
    methods:{
        handleOpen( data ){
            //console.log(data)
            return
        },

        handleClose ( data ) {
            //console.log(data)
            return
        },

        logout () {
            EventBus.$emit("logout", true)
        },

        toHome () {
            EventBus.$emit("toPage", '/home')
        },

        toAdmSet () {
            EventBus.$emit("toPage", '/adminsettings')
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
    padding-top:12px;
}

#header-left{
    position:absolute;
    left:20px;
    top: 8px;
    opacity: .9;
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
    font-weight: bold;
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


#header-logout span{
    opacity: 0.8;
    color:#f56c6c;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

#header-logout span:hover{
    opacity: 1;
}

#header-user{
    display:flex;
    margin-top:-5px;
    margin-right: 32px;
    opacity: .8;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

#header-user:hover {
    opacity: 1;
}



#header-user-name {
    margin-top: 5px;
    margin-left: 8px;
    
}



</style>

