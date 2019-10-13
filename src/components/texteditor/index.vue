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
            <button @click="showUpWin(commands.iimage, 'Image')">
                <span class="material-icons">image</span>
            </button>

            <!-- File -->
            <button @click="showUpWin(commands.ilink, 'Files')">
                <span class="material-icons">insert_drive_file</span>
            </button>

            <!-- Website Link -->
            <button @click="showLinkDialog(commands.ilink)">
                <span class="material-icons">link</span>
            </button>

            <!-- IFrame Upload -->
            <button @click="showIframePrompt(commands.iframe)">
                <span class="material-icons">video_library</span>
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

      <editor-content class="editor-content" :editor="editor" :autoFocus="true" />
      
      <upload-window 
        v-if="upload_win" 
        @uploaded="uploadHandler" 
        @close="closeUpWin" 
        :base="base"
        :allowSelect="true" 
        :allowMultiple="upload_win_multiple"
        :allowUrl="upload_win_url" 
        :allowType="upload_win_type">
      </upload-window>
      

    </div>
</template>

<script>

import { genGet } from '../../request'

// Material Design Icon Pack
import 'material-icons/iconfont/material-icons.css'
import uploadWindow from '../widgets/w_upload.vue'

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
        base: String
    },
    components: {
        EditorMenuBar,
        EditorContent,
        uploadWindow
    },
    data(){
        return {
            api_getLink: "/data/getlink/",
            editor: null,
            dialog_link_v: false,
            input_link: "",
            upload_win: false,
            current_command: "",
            upload_state: false, // Return bol
            upload_res: "", // Return URL
            upload_win_url: true,
            upload_win_type: "all"
        }
    },
    created () {

    },
    mounted () {
        var that = this
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
                new IImage({base: this.base}),
            ],
            onUpdate(){
                that.$emit('update', this.getHTML())
            }
        })
    },
    watch: {

    },
    beforeDestroy() {
        this.editor.destroy()
    },
    methods:{

        uploadHandler (d) {

            var data = d.data
            
            if(d.type_des.type === "Image"){
                
                if(d.multiple){
                    for(var i=0;i<data.length;i++){
                        
                        this.addImage(data[i].path, this.current_command, data[i].type)
                    }
                } else {
                    this.addImage(data.path, this.current_command, data.type)
                }
                
            } else {
                
                this.addFile(data.path, data.name, this.current_command, 'file')
                // Do nothing else for now
            }
        },

        // Add File Upload Window
        showUpWin(command, openType) {
            this.upload_win = true

            if(openType === "Image"){
                this.upload_win_multiple = true
                this.upload_win_url = true
            } else {
                this.upload_win_multiple = false
                this.upload_win_url = false
            }

            this.upload_win_type = openType
            this.current_command = ""
            this.$nextTick(()=>{
                this.current_command = command
            })
            
        },

        closeUpWin () {
            // Close Window
            this.upload_win = false
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
                var base = "[%bu%]"
                if(src.indexOf("http") != -1){
                    
                    base = ""
                }

                command({src: this.base + src, width:'100%'})
                // Close window
                this.closeUpWin()
            }
        },

        // Insert an File
        addFile (href, titleText, command) {

            if(href){
                command({href, titleText})
                // Close window
                this.closeUpWin()
            }
        },


        // Insert an iframe
        addIframe (src, command) {
            if(src) {
                command({src: src, height: "300px", width: "600px"})
            }
        },

        // Insert an link
        addLink (href, command) {

            genGet(this.base + this.api_getLink, [{name: "link", val: href}], (res)=>{
                var titleText = "Open Link: "
                if(res.status){
                    var mRes = res.data
                    var resSplit = mRes.split(':')
                    titleText = resSplit[1]
                    command({href, titleText})
                } else {
                    command({href, titleText})
                }
            })
        },

        openLink (url) {
            window.open(url, "_blank")
        },

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



</style>