<template>
    <div id="all">
        <div id="assets_upload">

        <div id="au_title">
            <span>Upload</span>
        </div>

        <el-tabs v-model="imgInsMode">
            <el-tab-pane label="Upload" name="upload"></el-tab-pane>
            <el-tab-pane label="Multiple" name="multiple" v-if="allowMultiple"></el-tab-pane>
            <el-tab-pane label="URL" name="url" v-if="allowUrl"></el-tab-pane>
            <el-tab-pane label="Gallery" name="gallery" v-if="allowSelect"></el-tab-pane>
        </el-tabs>


        <div id="au_upload_button" v-if="imgInsMode === 'upload'">

            <el-upload
                class="upload-win"
                drag
                action="0"
                :before-upload="beforeImgUpload"
                :http-request="uploadFile">

                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drop file <em>or click to upload</em></div>
                <div class="el-upload__tip" slot="tip">Image and document only, 8MB max</div>

            </el-upload>
 
        </div>

        <div id="au_upload_button" v-if="imgInsMode === 'multiple'">

            <el-upload
                class="upload-win"
                drag
                multiple
                action="0"
                :limit="6"
                :on-exceed="handleExceed"
                :on-remove="handleRemove"
                :http-request="pushToWaittingList">

                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drop multiple file <em>or click to upload</em></div>
                <div class="el-upload__tip" slot="tip">Image and document only, 8MB max</div>

            </el-upload>

            <div class="au_upload_confirm">
                <el-button type="primary" v-on:click="multipleUpload" v-if="waittingList.length > 0">Upload</el-button>
            </div>

            
 
        </div>

        <div id="au_url_input" v-if="imgInsMode === 'url'">

            <div class="au_url_input_box">
                <el-input v-model="inputedImg" placeholder="Input Image Url"></el-input>
            </div>
            
            <div class="au_assets_manager_btn">
                <el-button type="primary" style="width:80px;" v-on:click="submit(inputedImg, 'Image', 'noname', 0, false)" plain>OK</el-button>
            </div>
            
        </div>

        <div id="au_assets_manager" v-if="imgInsMode === 'gallery'">

            <div class="au_img_container" v-for="item in gallery" :key="item.id" :style="item.id == selected.id ? imgHighlight : imgNormal">

                <div class="file-single-img">
                    <el-image
                        class="file-single-img-img"
                        :style="item.type_des === 'Image' ? 'width: 100px; height: 100px' : 'width: 30px; height: 30px;margin-top: 35px;margin-left: -30px;'"
                        :src="item.type_des === 'Image' ? base_url + item.path : base_url + static_icons_url + getIcon(item.type)"
                        fit="contain"
                        v-on:click="selectItem(item.id, base_url+item.path, item.type_des, item.name)">
                        <div slot="placeholder" class="au_img_placeholder">
                            <span>Loading</span>
                        </div>
                    </el-image>

                    <span v-if="item.type_des !== 'Image'" class="file-single-des">
                        {{item.type_des}}
                    </span>

                    <span class="au_file_name" v-if="item.type_des !== 'Image'">{{realFileName(item.name)}}</span>
                </div>

            </div>

            <div class="au_assets_manager_btn">
                <el-button type="primary" style="width:80px;" v-on:click="submit(selected.path, selected.type, selected.name, 0, false)" plain>OK</el-button>
            </div>
        </div>

      </div>

      <div id="assets_upload_bg" v-on:click="close"></div>
    </div>
</template>

<script>

import { EventBus } from '../../bus.js'
import { idFileTypeDes, getFileIcon, getCookie } from '../../utils.js'
import BMF from 'browser-md5-file'

export default {
    name:"upload-window",
    components: {

    },
    props:{
        allowUrl: true,
        allowSelect: true,
        allowMultiple: true,
        allowType: String
    },
    data () {
        return {
            session: false,
            res: {},
            base_url: "https://api.isjeff.com/pot",
            static_icons_url: "/static/icons/",
            api_upFile: "https://api.isjeff.com/pot/manager/up_file/",
            api_getGallery: "https://api.isjeff.com/pot/manager/all_media/?ls=0&size=8",
            imgInsMode: "upload",
            gallery: [],
            inputedImg: "",
            selected: {},
            fileType: "",
            imgHighlight: "border: 1px solid #00B3FF",
            imgNormal: "border: 1px dashed rgba(0,0,0,0.1)",
            // For multiple upload
            waittingList:[],
            returnList:[],
        }
    },
    created () {
        var that = this
        that.initial()
        this.getGallery(this.allowType)
    },

    methods: {

        initial(){
            this.session = true
            this.inputedImg = ""
            this.selected = ""
            this.imgInsMode = "upload"
            this.res = {}
            this.waittingList = []
            this.returnList = []
        },

        getGallery (openMode) {

            var that = this
            this.gallery = []
            var api = this.api_getGallery

            if(openMode){
                api = this.api_getGallery + '&type=' + openMode
            } else {
                api = this.api_getGallery + '&type=All'
            }

            this.axios.get(api).then((response) => {
                var res = response.data.data
                that.gallery = res
            })
        },

        // Insert an image
        uploadFile (obj) {
            
            var that = this
            var img = obj.file
            var fileName = obj.file.name
            var fileType = idFileTypeDes(obj.file.name)

            // BMF plugin to read files md5
            const bmf = new BMF()

            bmf.md5(obj.file, (err, md5) => {
                let formObj = new FormData()
                formObj.append('file',img)
                formObj.append('name', fileName)
                formObj.append('typeDes', fileType.type)
                formObj.append('md5', md5)
                formObj.append('ukey', getCookie('u_key'))
                formObj.append('uuid', getCookie('u_uuid'))

                let h = {
                    headers:{'Content-Type':'multipart/form-data'}
                }

                that.$http.post(that.api_upFile,formObj,h)
                .then(function(response) {
                    var res = response.data
                    if(res.indexOf('success' != -1)) {

                        var r = res.split(',')

                        that.$notify({
                            title: "Finish",
                            type: 'success'
                        })

                        // If is not multiple upload
                        if(that.waittingList.length === 0){
                            that.submit(that.base_url + r[1], fileType, fileName, 0, false)
                        } else {
                            that.pushToReturnList(that.base_url + r[1], fileType, fileName)
                        }

                    } else {
                        that.$notify({
                            title: "Fail",
                            message: 'Error: ' + res,
                            type: 'warning'
                        })
                    }
                })
            })

        },

        pushToWaittingList (obj) {
            this.waittingList.push(obj)
        },

        pushToReturnList (url, type, name) {
            var res = {
                uploadState: true,
                type: type,
                name: name,
                path: url
            }
            this.returnList.push(res)

            // If finished than submit
            if(this.returnList.length === this.waittingList.length){
                this.submit(0, 0, 0, this.returnList, true)
            }
        },

        multipleUpload () {
            for(var i=0;i<this.waittingList.length;i++){
                this.uploadFile(this.waittingList[i])
            }
        },

        selectItem (id, url, type, name) {
            if(id === this.selected.id){
                this.selected = {}
            } else {
                this.selected = {
                    path: url,
                    type: idFileTypeDes(name),
                    name: name,
                    id: id
                }
            }
        },

        handleRemove (data) {
            for(var i=0;i<this.waittingList.length;i++){
                if(this.waittingList[i].file.uid == data.uid){
                    this.waittingList.splice(i, 1)
                }
            }
        },

        beforeImgUpload (file) {

            var fileSizeMB = file.size / 1024 / 1024

            /*if (file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'image/gif') {
                this.$message.error('JPG/PNG/GIF Image Only !')
                return false
            }*/

            if (fileSizeMB > 8) {
                this.$message.error('Maximum file size is: 8 MB!')
                return false
            }

            return true
        },

        handleExceed(){
            this.$message.error('6 files at a time')
        },

        submit (url, type, name, list, isMultiple) {

            if(isMultiple){

                this.$emit('uploaded', {multiple: true, data: list, type_des: 'Image'})

            } else {

                this.res = {
                    uploadState: true,
                    type: type,
                    name: name,
                    path: url
                }

                this.$emit('uploaded', {multiple: false, data: this.res, type_des: type})

            }
            
            this.close()
        },

        close () {
            this.session = false
            this.$emit('close', false)
        },

        getIcon (str) {
            return getFileIcon(str)
        },

        realFileName (str, limit) {
            var res
            var parse = str.split('_')
            var res = parse[parse.length-1].length < limit ? parse[parse.length-1] : parse[parse.length-1].slice(0, limit) + '...'

            return res
        }

    }
}
</script>

<style scoped>
    #assets_upload{
        background: rgba(255,255,255,1);
        position: fixed;
        width: 440px;
        height: 360px;
        padding: 20px;
        top: 28%;
        left: 36%;
        z-index:999;
        border-radius: 10px;
    }

    #assets_upload_bg{
        position: fixed;
        top:0px;
        left:0px;
        background: rgba(0,0,0,0.6);
        height:100%;
        width:100%;
        z-index:998;
    }


    #au_title{
        font-size: 18px;
        margin-bottom: 7px;
    }

    #au_assets_manager{
        display:flex;
        flex-wrap: wrap;
    }


    .au_img_container{
        width:100px;
        height:100px;
        margin-right: 4px;
        margin-bottom: 4px;
        border:1px dashed rgba(0,0,0,0.1);
        cursor: pointer;
    }

    .au_img_container:hover{
        background:rgba(0,0,0,0.05);
    }

    .au_img_placeholder{
        font-size:14px;
        opacity: 0.4;
        padding-left:26px;
        padding-top:40px;
    }

    .au_assets_manager_btn{
        position: absolute;
        bottom: 30px;
    }

    .au_file_name{
        margin-left: -100px;
        font-size: 8px;
        z-index: 99;
        position: absolute;
    }

    .file-single-img{
        display:flex;
        width:180px;
        height:180px;
        text-align: center;
    }

    .file-single-des{
        width: 60px;
        margin-top: 40px;
        margin-left: -32px;
        font-size: 10px;
        font-weight: bold;
        opacity: 0.7;
    }

    .au_upload_confirm{
        position: absolute;
        top: 340px;
        right: 20px;
    }
</style>