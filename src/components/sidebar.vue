<template>
    <div id="sidebar-cont">
        <el-row class="tac">
            <el-col :span="12">
                <el-menu
                default-active="1-1"
                :default-openeds=defaultOpeneds
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose">

                    <el-submenu index="1">
                        <template slot="title">
                                <i class="el-icon-house"></i>
                                <span class="el-sb-title">Basic</span>
                        </template>

                        <el-menu-item-group>

                            <el-menu-item index="1-1" v-on:click="toPage('./home')">
                                <i class="el-icon-data-line"></i>
                                <span>Home</span>
                            </el-menu-item>

                            <el-menu-item index="5-2" v-on:click="toPage('./settings')">
                                <i class="el-icon-setting"></i>
                                <span>Settings</span>
                            </el-menu-item>

                        </el-menu-item-group>

                    </el-submenu>

                    
                
                    <el-submenu index="2">
                        <template slot="title">
                                <i class="el-icon-reading"></i>
                                <span class="el-sb-title">Contents</span>
                        </template>

                        <el-menu-item-group>

                            <el-menu-item index="2-1" v-on:click="toPage('./postslist')">
                                <i class="el-icon-document-copy"></i>
                                <span>Posts</span>
                            </el-menu-item>

                            <el-menu-item index="2-2" v-on:click="toPage('./cateslist')">
                                <i class="el-icon-price-tag"></i>
                                <span>Categories</span>
                            </el-menu-item>

                        </el-menu-item-group>

                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-files"></i>
                            <span class="el-sb-title">Cloud</span>
                        </template>

                        <el-menu-item index="3-1" v-on:click="toPage('./fileslist')">
                            <i class="el-icon-receiving"></i>
                            <span>Files</span>
                        </el-menu-item>
                        
                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-sugar"></i>
                            <span class="el-sb-title">Outfit</span>
                        </template>

                        <el-menu-item index="4-1" v-on:click="toPage('./themeslist')">
                            <i class="el-icon-brush"></i>
                            <span>Themes</span>
                        </el-menu-item>

                        <el-menu-item index="4-2" v-on:click="toPage('./themesettings')">
                            <i class="el-icon-magic-stick"></i>
                            <span>Themes Settings</span>
                        </el-menu-item>

                        <el-menu-item index="4-3" v-on:click="toPage('./socialmedialist')">
                            <i class="el-icon-share"></i>
                            <span>Social Media</span>
                        </el-menu-item>

                        <el-menu-item index="4-5" v-on:click="toPage('./navslist')">
                            <i class="el-icon-connection"></i>
                            <span>Navigations</span>
                        </el-menu-item>

                    </el-submenu>

                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-umbrella"></i>
                            <span class="el-sb-title">Security</span>
                        </template>

                        <el-menu-item index="5-1" v-on:click="toPage('./visitorlist')">
                            <i class="el-icon-view"></i>
                            <span>Visitors</span>
                        </el-menu-item>

                        
                        <el-menu-item index="5-3" v-on:click="toPage('./adminsettings')">
                            <i class="el-icon-user"></i>
                            <span>Admin</span>
                        </el-menu-item>


                    </el-submenu>

                    <el-submenu index="6">
                        <template slot="title">
                            <i class="el-icon-coordinate"></i>
                            <span class="el-sb-title">Testing Function</span>
                        </template>

                        <el-menu-item index="6-1" v-on:click="toPage('./visittest')">User Visit</el-menu-item>
                        <el-menu-item index="6-2" v-on:click="toPage('./visittestadm')">Admin Visit</el-menu-item>

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
    },
    data (){
        return {
            defaultOpeneds: ["1","2","3","4"],
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

    .tac{
        margin-top:40px;
    }

    .el-col-12{
        width:100%;
    }

    .el-sb-title{
        font-weight: bold;
    }


</style>