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
                        <span slot="title" v-on:click="toPage('./home')">Global 全局</span>
                    </el-menu-item>
                
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>Posts 文章</span>
                        </template>

                        <el-menu-item-group title="所有">
                            <el-menu-item index="2-1" v-on:click="toPage('./postslist')">All Posts 所有文章</el-menu-item>
                            <el-menu-item index="2-2" v-on:click="toPage('./cateslist')">All Categories 所有分类</el-menu-item>
                        </el-menu-item-group>

                        <!--el-menu-item-group title="Status">
                            <el-menu-item index="2-3">Public 公开</el-menu-item>
                            <el-menu-item index="2-4">Saved 已保存</el-menu-item>
                            <el-menu-item index="2-5">Deleted 回收站</el-menu-item>
                        </el-menu-item-group-->
                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>Library 库</span>
                        </template>

                        <el-menu-item index="3-1" disable>All Files 所有文件</el-menu-item>

                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>Others 其他</span>
                        </template>

                        <el-menu-item index="4-1" disable>Social Network 社交网络</el-menu-item>
                        <el-menu-item index="4-2" disable>Share 分享功能</el-menu-item>

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
            console.log(data)
            return
        },
        handleClose ( data ) {
            console.log(data)
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
    }

    .el-col-12{
        width:100%;
    }
</style>