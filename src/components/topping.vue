<template>
    <div id="header-cont">
        <div id="header-content">
            <div id="header-left">
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
                        <span>Administrator</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"topping",
    props:{
    },
    data (){
        return {
            hello: "",
        }
    },
    created () {
        console.log('header created')
    },
    methods:{
        handleOpen( data ){
            console.log(data)
            return
        },
        handleClose ( data ) {
            console.log(data)
            return
        }
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
}

#header-right{
    position:absolute;
    right:40px;
}

#header-right span{
    color:#ffffff;
    font-size:16px;
}

#header-user-avator img{
    width:32px;
}

#header-user-name {
    margin-top:5px;
    margin-left:5px;
}

</style>

