import { Node } from 'tiptap'

export default class ILink extends Node {

  get name() {
    return 'ilink'
  }

  get schema() {
    return {
      attrs: {
        href: {
            default: null
        },
        titleText:{
            default: "Open"
        },
        type:{
          default: "link"
        }
      },
      group: 'block',
      selectable: true,
      parseDOM: [{
        tag: 'a',
        getAttrs: dom => ({
          href: dom.getAttribute('herf'),
          target: '_blank',
          dataType: this.type
        })

      }],
      toDOM: node => {
        return [
          'a', 
          { href: node.attrs.href, class: "ilink__embed", target: '_blank', dataType: node.attrs.type}, 

          `${node.attrs.titleText}`
        ]
      }
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
        href: {
          get() {
            return this.node.attrs.href
          },
          set(href) {
            this.updateAttrs({
              href
            })
          },
        },
        titleText: {
            get() {
                return this.node.attrs.titleText
            },
            set(titleText) {
                this.updateAttrs({
                    titleText,
                })
            },
        }
      },
      template: `
        <div class="ilink">
            <a class="ilink__embed" :href="href" target="_blank" :dataType="type">{{titleText}}</a>
        </div>
      `,
    }
  }

}