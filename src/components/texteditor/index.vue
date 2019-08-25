<template>
    <div class="text-editor">
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="editor-bar">
          <button :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
            <span class="material-icons">format_bold</span>
          </button>
          <button :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })">
            H2
          </button>
        </div>
      </editor-menu-bar>

      <editor-content :editor="editor" />
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
        console.log(that.text)
        this.editor = new Editor({
            content: that.text,
            extensions: [
                new Image(),
                new Blockquote(),
                new CodeBlock(),
                new HardBreak(),
                new Heading({ levels: [1, 2, 3] }),
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
}
</script>


<style scoped>

</style>