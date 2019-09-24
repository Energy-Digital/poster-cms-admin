<template>
    <div id="sidebar-cont">
        <el-row class="tac">
            <el-col :span="12">
                <el-menu
                default-active="1"
                :default-openeds=defaultOpeneds
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">

                    <el-menu-item index="1">
                        <i class="el-icon-setting"></i>
                        <span slot="title" v-on:click="toPage('./home')">Home</span>
                    </el-menu-item>
                
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>Posts</span>
                        </template>

                        <el-menu-item-group>
                            <el-menu-item index="2-1" v-on:click="toPage('./postslist')">Posts</el-menu-item>
                            <el-menu-item index="2-2" v-on:click="toPage('./cateslist')">Categories</el-menu-item>
                        </el-menu-item-group>

                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>Library</span>
                        </template>

                        <el-menu-item index="3-1" v-on:click="toPage('./fileslist')">Files</el-menu-item>
                        

                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>Others</span>
                        </template>

                        <!--el-menu-item index="4-1" v-on:click="toPage('./visittest')">Visit Record Test</el-menu-item-->
                        <el-menu-item index="4-2" v-on:click="toPage('./visitorlist')">Visitors</el-menu-item>
                        <el-menu-item index="4-3" v-on:click="toPage('./socialmedialist')">Social Media</el-menu-item>
                        <el-menu-item index="4-4" v-on:click="toPage('./settings')">Settings</el-menu-item>
                        <el-menu-item index="4-5" v-on:click="toPage('./adminsettings')">Admin</el-menu-item>

                    </el-submenu>

                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>Testing Function</span>
                        </template>

                
                        <el-menu-item index="5-1" v-on:click="toPage('./visittest')">User Visit</el-menu-item>
                        <el-menu-item index="5-2" v-on:click="toPage('./visittestadm')">Admin Visit</el-menu-item>

                    </el-submenu>

                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>


<script>
import { EventBus } from '../bus.js'

export default {
    name: "sidebar",
    props:{
        msg: String,
    },
    data (){
        return {
            defaultOpeneds: ["2","3","4"],
        }
    },
    created () {

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
        toPage (path) {
            EventBus.$emit('toPage', path)
        }
    }

}
</script>


<style scoped>
    #sidebar-cont{
        height:100%;
        overflow-y: scroll;
    }

    .el-col-12{
        width:100%;
    }
</style>