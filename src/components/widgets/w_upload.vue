<template>
    <div id="all">
        <div id="assets_upload">

        <div id="au_title">
            <span>Upload</span>
        </div>

        <el-tabs v-model="imgInsMode">
            <el-tab-pane label="Upload" name="upload"></el-tab-pane>
            <el-tab-pane label="Multiple" name="multiple" v-if="allowMultiple"></el-tab-pane>
            <el-tab-pane label="COS" name="cos" v-if="allowCOS"></el-tab-pane>
            <el-tab-pane label="URL" name="url" v-if="false"></el-tab-pane>
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
                <div class="el-upload__text">Drop multiple image <em>or click to upload</em></div>
                <div class="el-upload__tip" slot="tip">Image only, 8MB max</div>

            </el-upload>

            <div class="au_upload_confirm">
                <el-button type="primary" v-on:click="multipleUpload" v-if="waittingList.length > 0">Upload</el-button>
            </div>

            
 
        </div>

        <div id="au_upload_button" v-if="imgInsMode === 'cos'">

            <el-upload
                class="upload-win"
                drag
                action="0"
                :before-upload="beforeImgUpload"
                :http-request="cosFileUpload">

                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drop file <em>or click to upload</em></div>
                <div class="el-upload__tip" slot="tip">Image and document only, 8MB max</div>

            </el-upload>

            <div id="progress" v-show="progress.percent < 1">Progress: {{ (progress.percent * 100) + '%' }} | Speed: {{progress.speed}}</div>
 
        </div>

        <div id="au_url_input" v-if="imgInsMode === 'url'">

            <div class="au_url_input_box">
                <el-input v-model="inputedImg" placeholder="Input Image Url"></el-input>
            </div>
            
            <div class="au_assets_manager_btn">
                <el-button type="primary" style="width:80px;" v-on:click="submit(inputedImg, {type: 'Image', icon:0}, 'noname', 0, false)" plain>OK</el-button>
            </div>
            
        </div>

        <div id="au_assets_manager" v-if="imgInsMode === 'gallery'">

            <div class="au_img_container" v-for="item in gallery" :key="item.id" :style="item.id == selected.id ? imgHighlight : imgNormal">

                <div class="file-single-img">
                    <el-image
                        class="file-single-img-img"
                        :style="item.type_des === 'Image' ? 'width: 100px; height: 100px' : 'width: 30px; height: 30px;margin-top: 35px;margin-left: 35px;'"
                        :src="readAMImageType(item)"
                        fit="contain"
                        v-on:click="selectItem(item.id, item.path, item.type_des, item.name)">
                        <div slot="placeholder" class="au_img_placeholder">
                            <span>Loading</span>
                        </div>
                    </el-image>

                    <span class="au_file_name" v-if="item.type_des !== 'Image'">{{realFileName(item.name, 14)}}</span>
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
import { idFileTypeDes, getFileIcon, getGlobalStatus, getFileExtension } from '../../utils.js'
import { genGet, genUpload, cosUpload, genUpdate } from '../../request'

import { EventBus } from '../../bus'
import BMF from 'browser-md5-file'

export default {
    name:"upload-window",
    components: {

    },
    props:{
        allowUrl: {
            type: Boolean,
            default: true
        },
        allowSelect: {
            type: Boolean,
            default: true
        },
        allowMultiple: {
            type: Boolean,
            default: true
        },
        allowType: String,
        base: String
    },
    data () {
        return {
            session: false,
            res: {},
            static_icons_url: "/static/icons/",
            api_upFile: "/manager/up_file/",
            api_addFile: "/manager/add_file/",
            api_getGallery: "/manager/all_media/",
            api_tosTmpKey: "/data_enc/cos_enc/",
            allowCOS: false,
            imgInsMode: "upload",
            gallery: [],
            inputedImg: "",
            selected: {},
            fileType: "",
            progress: {
                loaded: 0,
                total: 0,
                speed: 0,
                percent: 0
            },
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

        this.allowCOS = getGlobalStatus('poster_cos_enable')

        EventBus.$on("upload-progress", (data)=>[
            this.progress = data
            //console.log(data)
        ])

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
            var param = []
            
            if(openMode){
                param = [{name: "type", val: openMode}, {name: "size", val: "8"}]
            } else {
                param = [{name: "type", val: "All"}, {name: "size", val: "8"}]
            }

            genGet(this.base + this.api_getGallery, param, (res)=>{
                that.gallery = res.data.data
            })
        },

        cosFileUpload(obj){
            var that = this

            let bucket = getGlobalStatus('poster_cos_bucket')
            let region = getGlobalStatus('poster_cos_region')

            const fileName = obj.file.name
            const fileType = idFileTypeDes(obj.file.name)
            const fileExt = getFileExtension(obj.file.name)

            cosUpload(this.base + this.api_tosTmpKey, bucket, region, obj.file, fileName, (res)=>{
                if(res.status){
                    
                    that.submit(res.data.Location, fileType, fileName, 0, false)

                    genUpdate(that.base + that.api_addFile, {
                        name: fileName,
                        end: fileExt,
                        des: fileType.type,
                        url: res.data.Location
                    }, (res)=>{
                        if(res.status){
                            // Do nothing
                        }

                        // do nothing
                    })
                }
                
            })
        },

        // Insert an image
        uploadFile (obj) {
            
            var that = this
            var file = obj.file
            var fileName = obj.file.name
            var fileType = idFileTypeDes(obj.file.name)


            if(!fileType) {
                this.$notify({
                    title: "File type not allowed",
                    type: 'warning'
                })
                //this.close()
            } else {
                // BMF plugin to read files md5
                const bmf = new BMF()

                bmf.md5(obj.file, (err, md5) => {
                    
                    genUpload(that.base + that.api_upFile, file, {
                        name: fileName,
                        type: fileType,
                        md5: md5
                    }, (res)=>{

                        if(res.status){
                            
                            var r = res.data.split(',')

                            that.$notify({
                                title: "Finish",
                                type: 'success'
                            })

                            // If is not multiple upload
                            if(that.waittingList.length === 0){
                                // r1 is link
                                that.submit(r[1], fileType, fileName, 0, false)
                            } else {
                                that.pushToReturnList(r[1], fileType, fileName)
                            }
                        } else {
                            that.$notify({
                                title: "Fail",
                                message: 'Error: ' + res.data,
                                type: 'warning'
                            })
                        }
                    })

                })
            }

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

                this.$emit('uploaded', {multiple: true, data: list, type_des: {type: 'Image', icon:0}})

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
            res = parse[parse.length-1].length < limit ? parse[parse.length-1] : parse[parse.length-1].slice(0, limit) + '...'

            return res
        },

        // Because COS, it needs more complex config
        readAMImageType(item){
            
            // If is COS
            if(item.isCOS == '1'){
                return 'https://' + item.path
            }

            // If is not COS but image
            else if(item.type_des === 'Image'){
                return this.base + item.path
            } 
            
            // If is not COS and not image
            else {
                return this.base + this.static_icons_url + this.getIcon(item.type)
            }
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