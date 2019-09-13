import { Node } from 'tiptap'
import { textblockTypeInputRule, toggleBlockType } from 'tiptap-commands'

export default class Size extends Node {

  get name() {
    return 'size'
  }

  get defaultOptions() {
    return {
      textSize: [16, 24, 36],
    }
  }

  get schema() {
    return {
      attrs: {
        textSize: {
          default: 16,
        },
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: this.options.textSize
        .map(textSize => ({
          tag: `p`,
          attrs: { textSize },
        })),
      toDOM: (node) => [ 'p', { style: `font-size: ${node.attrs.textSize}px` }, 0 ]
    }
  }

  commands({ type, schema }) {
    return attrs => toggleBlockType(type, schema.nodes.size, attrs)
  }


  inputRules({ type }) {
    return this.options.textSize.map(size => textblockTypeInputRule(
      new RegExp(`^(#{1,${size}})\\s$`),
      type,
      () => ({ size }),
    ))
  }

}


