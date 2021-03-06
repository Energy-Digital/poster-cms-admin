import { Node } from 'tiptap'

export default class Iframe extends Node {

  get name() {
    return 'iframe'
  }

  get schema() {
    return {
      attrs: {
        src: {
          default: null,
        },
        height: {
          default: null,
        },
        width: {
          default: null,
        }
      },
      group: 'block',
      selectable: false,
      parseDOM: [{
        tag: 'iframe',
        getAttrs: dom => ({
          height: dom.getAttribute('height'),
          width: dom.getAttribute('width'),
          src: dom.getAttribute('src'),
        }),
      }],
      toDOM: node => ['iframe', {
        src: node.attrs.src,
        width: node.attrs.width,
        height: node.attrs.height,
        frameborder: 0,
        allowfullscreen: 'true',
      }],
    }
  }

  commands({ type }) {
    return attrs => (state, dispatch) => {
      const { selection } = state
      const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos
      const node = type.create(attrs)
      const transaction = state.tr.insert(position, node)
      dispatch(transaction)
    }
  }

  get view() {
    return {
      props: ['node', 'updateAttrs', 'view'],
      computed: {
        src: {
          get() {
            return this.node.attrs.src
          },
          set(src) {
            this.updateAttrs({
              src,
            })
          },
        },

        height: {
          get() {
            return this.node.attrs.height
          },
          set(height) {
            this.updateAttrs({
              height,
            })
          },
        },

        width: {
          get() {
            return this.node.attrs.width
          },
          set(width) {
            this.updateAttrs({
              width,
            })
          },
        },
      },
      template: `
        <div class="iframe">
          <iframe class="iframe__embed" :src="src" :height="height" :width="width"></iframe>
        </div>
      `,
    }
  }

}