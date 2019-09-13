import { Node } from 'tiptap'

export default class ILink extends Node {

  get name() {
    return 'ilink'
  }

  get schema() {
    return {
      attrs: {
        href: {
            default: null,
        },
        titleText:{
            default: null,
        },
      },
      group: 'block',
      selectable: true,
      parseDOM: [{
        tag: 'a',
        getAttrs: dom => ({
          href: dom.getAttribute('herf'),
        }),
      }],
      toDOM: node => ['a', {
        href: node.attrs.href,
        target: '_blank'
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
        href: {
          get() {
            return this.node.attrs.href
          },
          set(href) {
            this.updateAttrs({
              href,
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
            <!--span class="material-icons" style="color:rgba(0,0,0,0.2);">link</span-->
            <a class="ilink__embed" :href="href" target="_blank" style="color:rgba(0,0,0,0.7);padding:10px;background:rgba(237,241,243,1);border:1px solid rgba(0,0,0,0.15);border-radius:8px;font-size:14px;"><span class="material-icons" style="font-size:14px;padding-right:6px;transform: rotate(-45deg);">link</span>{{titleText}}</a>
        </div>
      `,
    }
  }

}