<template>
    <div class="text-editor">
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
          <div class="editor-bar">

            <!-- Bold -->
            <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
                <span class="material-icons">format_bold</span>
            </button>

            <!-- Italic -->
            <button :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
                <span class="material-icons">format_italic</span>
            </button>

            <!-- Underline -->
            <button :class="{ 'is-active': isActive.underline() }" @click="commands.underline">
                <span class="material-icons">format_underlined</span>
            </button>
            
            <!-- Headline Text Size 1 -->
            <button :class="{ 'is-active': isActive.size({ textSize: 32 }) }" @click="commands.size({ textSize: 32 })">
                <p style="font-weight:bold;">H1</p>
            </button>

            <!-- Headline Text Size 2 -->
            <button :class="{ 'is-active': isActive.size({ textSize: 28 }) }" @click="commands.size({ textSize: 28 })">
                <p style="font-weight:bold;">H2</p>
            </button>

            <!-- Headline Text Size 3 -->
            <button :class="{ 'is-active': isActive.size({ textSize: 24 }) }" @click="commands.size({ textSize: 24 })">
                <p style="font-weight:bold;">H3</p>
            </button>

            <!-- Headline Text Size 3 -->
            <button :class="{ 'is-active': isActive.size({ textSize: 16 }) }" @click="commands.size({ textSize: 16 })">
                <p style="font-weight:bold;">NS</p>
            </button>

            <!-- Alignment Left -->
            <button :class="{ 'is-active': isActive.paragraph({ textAlign: 'left' }) }" @click="commands.paragraph({ textAlign: 'left' })">
                <span class="material-icons">format_align_left</span>
            </button>

            <!-- Alignment Center -->
            <button :class="{ 'is-active': isActive.paragraph({ textAlign: 'center' }) }" @click="commands.paragraph({ textAlign: 'center' })">
                <span class="material-icons">format_align_center</span>
            </button>

            <!-- Alignment right -->
            <button :class="{ 'is-active': isActive.paragraph({ textAlign: 'right' }) }" @click="commands.paragraph({ textAlign: 'right' })">
                <span class="material-icons">format_align_right</span>
            </button>

            <!-- Bullet List -->
            <button :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
                <span class="material-icons">format_list_bulleted</span>
            </button>

            <!-- Order List -->
            <button :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
                <span class="material-icons">format_list_numbered</span>
            </button>

            <!-- Quote -->
            <button :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote">
                <span class="material-icons">format_quote</span>
            </button>

            <!-- Code -->
            <button :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block">
                <span class="material-icons">code</span>
            </button>

            <!-- Image Upload -->
            <button @click="showImagePrompt(commands.iimage)">
                <span class="material-icons">image</span>
            </button>

            <!-- IFrame Upload -->
            <button @click="showIframePrompt(commands.iframe)">
                <span class="material-icons">video_library</span>
            </button>

            <!-- Website Link -->
            <button @click="showLinkDialog(commands.ilink)">
                <span class="material-icons">link</span>
            </button>
            
            <!-- Horizontal Line -->
            <button @click="commands.horizontal_rule">
                <span class="material-icons">drag_handle</span>
            </button>

            <!-- History Backward -->
            <button @click="commands.undo">
                <span class="material-icons">undo</span>
            </button>

            <!-- History Forward -->
            <button @click="commands.redo">
                <span class="material-icons">redo</span>
            </button>
            
        </div>
      </editor-menu-bar>

      <editor-content class="editor-content" :editor="editor" />

      <div id="assets_upload" v-if="upload_win">

        <div id="au_title">
            <span>Upload Image</span>
        </div>

        <el-tabs v-model="imgInsMode">
            <el-tab-pane label="Upload" name="upload"></el-tab-pane>
            <el-tab-pane label="URL" name="url"></el-tab-pane>
            <el-tab-pane label="Gallery" name="gallery"></el-tab-pane>
        </el-tabs>


        <div id="au_upload_button" v-if="imgInsMode === 'upload'">

            <el-upload
                class="upload-win"
                drag
                action="0"
                :before-upload="beforeImgUpload"
                :http-request="uploadImg">

                <i class="el-icon-upload"></i>
                <div class="el-upload__text">Drop file <em>or click to upload</em></div>
                <div class="el-upload__tip" slot="tip">jpg/png/gif only, 8 MB maximum</div>

            </el-upload>
 
        </div>

        <div id="au_url_input" v-if="imgInsMode === 'url'">

            <div class="au_url_input_box">
                <el-input v-model="inputedImg" placeholder="Input Image Url"></el-input>
            </div>
            
            <div class="au_assets_manager_btn">
                <el-button type="primary" style="width:80px;" v-on:click="addImage(inputedImg, img_command);closeUpWin()" plain>OK</el-button>
            </div>
            
        </div>

        <div id="au_assets_manager" v-if="imgInsMode === 'gallery'">

            <div class="au_img_container" v-for="item in gallery" :key="item.id" :style="item.id == selectedImg.id ? imgHighlight : imgNormal">

                <el-image
                    style="width: 100px; height: 100px"
                    :src="base_url+item.path"
                    fit="contain"
                    v-on:click="amSelectImg(item.id, base_url+item.path)">
                    <div slot="placeholder" class="au_img_placeholder">
                        <span>Loading</span>
                    </div>
                </el-image>
            </div>

            <div class="au_assets_manager_btn">
                <el-button type="primary" style="width:80px;" v-on:click="addImage(selectedImg.path, img_command);closeUpWin()" plain>OK</el-button>
            </div>
        </div>

      </div>

      <div id="assets_upload_bg" v-if="upload_win" v-on:click="closeUpWin"></div>

    </div>
</template>

<script>
// Material Design Icon Pack
import 'material-icons/iconfont/material-icons.css'

// Import Tiptap Editor
import { Editor, EditorContent, EditorMenuBar  } from 'tiptap'
import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    Italic,
    Link,
    Strike,
    Underline,
    History,
} from 'tiptap-extensions'

import Iframe from './ewidget/iframe.js'
import ILink from './ewidget/ilink.js'
import IParagraph from './ewidget/iparagraph.js'
import ISize from './ewidget/isize.js'
import IImage from './ewidget/iimage.js'

export default {
    name: "texteditor",
    props:{
        text: String,
    },
    components: {
        EditorMenuBar,
        EditorContent
    },
    data(){
        return {
            base_url: "https://api.isjeff.com/pot/",
            api_getLink: "https://api.isjeff.com/pot/data/getlink/",
            api_upImg: "https://api.isjeff.com/pot/manager/up_img/",
            api_getGallery: "https://api.isjeff.com/pot/manager/all_media/?limit=8",
            editor: null,
            dialog_link_v: false,
            input_link: "",
            upload_win: false,
            img_command: "",
            imgInsMode: "upload",
            gallery: [],
            inputedImg: "",
            selectedImg: {},
            imgHighlight: "border: 1px solid #00B3FF",
            imgNormal: "border: 1px dashed rgba(0,0,0,0.1)"
        }
    },
    created () {
        this.getGallery()
        // this.text = this.text ? "No Content" : this.text
    },
    mounted () {
        var that = this
        // console.log(that.text)
        this.editor = new Editor({
            content: that.text,
            extensions: [
                new Blockquote(),
                new CodeBlock(),
                new HardBreak(),
                new ISize({ textSize: [24, 28, 32] }),
                new HorizontalRule(),
                new BulletList(),
                new OrderedList(),
                new ListItem(),
                new TodoItem(),
                new TodoList(),
                new Bold(),
                new Code(),
                new Italic(),
                new Link(),
                new Strike(),
                new Underline(),
                new History(),
                new Iframe(),
                new ILink(),
                new IParagraph(),
                new IImage()
            ],
            onUpdate(){
                that.$emit('update', this.getHTML())
            }
        })
    },
    watch: {
        text: function () {
            
            // this.editor.content = this.text
        }
    },
    beforeDestroy() {
        this.editor.destroy()
    },
    methods:{

        getGallery () {
            var that = this
            this.axios.get(this.api_getGallery).then((response) => {
                var res = response.data
                that.gallery = res
            })
        },

        // Add Image Input Window
        showImagePrompt(command) {
            this.upload_win = true
            this.img_command = command
        },

        // Add Iframe Input Window
        showIframePrompt (command) {

            this.$prompt('Input Video Url', 'Insert', {

            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            inputPlaceholder: 'Input url link from <iframe> tag src= attrribute'

            }).then(({ value }) => {

                if(value != null){
                    this.addIframe(value, command)
                }


                this.$message({
                    type: 'success',
                    message: 'Video Added'
                })

            }).catch((err) => {
                /*console.log(err)
                this.$message({
                    type: 'info',
                    message: '输入取消'
                })*/       
            })
            
        },

        showLinkDialog (command) {
            var val = prompt('Input Website Link')
            if(val){
                this.addLink(val, command)
            }


            // BUG Cause lost focus and position issue
            /*this.$prompt('Input Website Link', 'Insert', {

            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',

            }).then(({ value }) => {

                if(value != null){
                    this.addLink(value, command)
                }

                this.$message({
                    type: 'success',
                    message: 'Link Added'
                })

            }).catch((err) => {
                this.$message({
                    type: 'info',
                    message: '输入取消'
                })       
            })*/
        },

        // Insert an image
        addImage (src, command) {

            if(src){
                command({src, width:'100%'})
                // Close window
                this.closeUpWin()
            }
        },


        // Insert an iframe
        addIframe (src, command) {
            if(src) {
                command({src})
            }
        },

        // Insert an link
        addLink (href, command) {
            var that = this

            // Request my own get title server
            this.axios.get(this.api_getLink + "?link="+href).then(response => {
                var res = response.data
                var resSplit = res.split(':')
                var titleText = "Open Link: "
                if(res.indexOf("success") != -1){
                    titleText = resSplit[1]
                    command({href, titleText})
                } else {
                    command({href, titleText})
                }
            })
        },

        beforeImgUpload (file) {

            var fileSizeMB = file.size / 1024 / 1024

            if (file.type != 'image/jpeg' && file.type != 'image/png' && file.type != 'image/gif') {
                this.$message.error('JPG/PNG/GIF Image Only !')
                return false
            }

            if (fileSizeMB > 8) {
                console.log(file.size / 1024 / 1024)
                this.$message.error('Maximum File Size: 8 MB !')
                return false
            }

            return true
        },

        // Insert an image
        uploadImg (obj) {
            var that = this
            var img = obj.file

            let formObj = new FormData()

            formObj.append('file',img)

            let h = {
                headers:{'Content-Type':'multipart/form-data'}
            }

            this.$http.post(this.api_upImg,formObj,h)
            .then(function(response) {
                var res = response.data
                if(res.indexOf('success' != -1)) {

                    var r = res.split(',')
                    
                    // Get image command from the local temp variable
                    // Call add image func
                    that.addImage(that.base_url + r[1], that.img_command)

                    // Clear image command
                    that.img_command = ""

                    that.$notify({
                        title: "Uploaded",
                        message: 'Upload Successful: ' + r[1],
                        type: 'success'
                    })

                } else {
                    that.$notify({
                        title: "Upload Fail",
                        message: 'Error: ' + res,
                        type: 'warning'
                    })
                }
            })
        },


        closeUpWin () {
            // Clean Stroaged selected item
            this.selectedImg = {}
            this.inputedImg = ""

            // Close Window
            this.upload_win = false
        },

        openLink (url) {
            window.open(url, "_blank")
        },

        amSelectImg (id, url) {
            if(id === this.selectedImg.id){
                this.selectedImg = {}
            } else {
                this.selectedImg = {
                    path: url,
                    id: id
                }
            }
        }

    }
}
</script>


<style scoped>

button{
    width:40px;
    height:40px;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius:4px;
    background:#ffffff;
    color:#333;
}

button:hover{
    border: 1px solid rgba(0,0,0,0.15);
    background:#fafafa;
}

button span{
    font-size:20px;
    padding-top:4px;
    padding-bottom:-5px;
}

button p{
    font-size:12px;
    padding-top:4px;
    padding-bottom:-5px;
}


.is-active{
    border: 2px solid rgba(0,0,0,0.3);
}

.is-active:hover{
    border: 2px solid rgba(0,0,0,0.35);
}

.text-editor{
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 8px;
}

.editor-bar{
    text-align: left;
    padding:8px;
    background:#fafafa;
    border-bottom: 1px solid rgba(0,0,0,0.1)
}

.editor-bar button{
    margin-right:4px;
}

.editor-content{
    background:#fff;
    padding:8px;
    height:500px;
    overflow-y: scroll;
}

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

</style>