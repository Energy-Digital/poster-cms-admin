<template>
    <div id="all">
        <div id="title">
            <WTitle txt="Edit Category"></WTitle>
        </div>

        <div id="post-lang-selector">
            <el-radio-group v-model="postLang" style="margin-bottom: 30px;">
                <el-radio-button label="0">English</el-radio-button>
                <el-radio-button label="1">中文</el-radio-button>
            </el-radio-group>
        </div>
        
        <div id="form">
            <span v-if="postLang === '0'">Category Name</span>
            <span v-if="postLang === '1'">分类名称</span>
            <br>
            <el-input v-model="cateData.cname" placeholder="Please Input Name" v-if="postLang === '0'"></el-input>
            <el-input v-model="cateData.cname_sublang" placeholder="请输入分类名称" v-if="postLang === '1'"></el-input>
            <br>

            <span v-if="postLang === '0'">Category Description</span>
            <span v-if="postLang === '1'">分类描述</span>
            <br>
            <el-input
                type="textarea"
                :rows="3"
                v-if="postLang === '0'"
                placeholder="Please Input Description"
                v-model="cateData.des">
            </el-input>
            <el-input
                type="textarea"
                :rows="3"
                v-if="postLang === '1'"
                placeholder="请输入分类描述"
                v-model="cateData.des_sublang">
            </el-input>
            <br>
            
            
            
        </div>

    </div>
</template>

<script>

import WTitle from '../widgets/w_title.vue'

export default {
    name:"catesingle",
    props:{
        cateId: {
            type: String,
            default: "0"
        }
    },
    components:{
        WTitle
    },
    data(){
        return{
            api:"http://api.isjeff.com/pot/data/post_cate/",
            cateData: "",
            postLang: "0"
        }
    },
    created(){
        this.getData()
    },
    methods:{
        getData(){
            this.axios.get(this.api+"?cid="+this.cateId).then((response)=>{
                this.cateData = response.data[0]
            })
        },

        submit(){

        }
    }
}
</script>

<style scoped>

</style>