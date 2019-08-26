<template>
    <div class="text-editor">
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="editor-bar">

            <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
                <span class="material-icons">format_bold</span>
            </button>

            <button :class="{ 'is-active': isActive.italic() }" @click="commands.italic">
                <span class="material-icons">format_italic</span>
            </button>

            <button :class="{ 'is-active': isActive.underline() }" @click="commands.underline">
                <span class="material-icons">format_underlined</span>
            </button>
            
            <button :class="{ 'is-active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })">
                <p style="font-weight:bold;">H1</p>
            </button>

            <button :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
                <p style="font-weight:bold;">H2</p>
            </button>

            <button :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })">
                <p style="font-weight:bold;">H3</p>
            </button>

            <button :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list">
                <span class="material-icons">format_list_bulleted</span>
            </button>

            <button :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list">
                <span class="material-icons">format_list_numbered</span>
            </button>

            <button :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote">
                <span class="material-icons">format_quote</span>
            </button>

            <button :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block">
                <span class="material-icons">code</span>
            </button>

            <button @click="showImagePrompt(commands.image)">
                <span class="material-icons">image</span>
            </button>

            <button @click="commands.horizontal_rule">
                <span class="material-icons">drag_handle</span>
            </button>

            <button @click="commands.undo">
                <span class="material-icons">undo</span>
            </button>

            <button @click="commands.redo">
                <span class="material-icons">redo</span>
            </button>
            
        </div>
      </editor-menu-bar>

      <editor-content class="editor-content" :editor="editor" />

    </div>
</template>

<script>
// Material Design Icon Pack
import 'material-icons/iconfont/material-icons.css'

// Import Tiptap Editor
import { Editor, EditorContent, EditorMenuBar  } from 'tiptap'
import {
    Image,
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
            editor: null,
        }
    },
    created () {
        // this.text = this.text ? "No Content" : this.text
    },
    mounted () {
        var that = this
        // console.log(that.text)
        this.editor = new Editor({
            content: that.text,
            extensions: [
                new Image(),
                new Blockquote(),
                new CodeBlock(),
                new HardBreak(),
                new Heading({ levels: [1, 2, 3] }),
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
        showImagePrompt(command) {
            const src = prompt('Enter the url of your image here')
            if (src !== null) {
                command({ src })
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
    border: 1px solid #409eff;
    background:#409eff;
    color:#ffffff;
}

.is-active:hover{
    border: 1px solid #409eff;
    background:#409eff;
    color:#ffffff;
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