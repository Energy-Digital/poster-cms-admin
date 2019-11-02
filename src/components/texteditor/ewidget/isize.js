import { Node } from 'tiptap'
import { textblockTypeInputRule, toggleBlockType } from 'tiptap-commands'

export default class Size extends Node {

  get name() {
    return 'size'
  }

  get defaultOptions() {
    return {
      textSizes: ["16px", "24px", "36px"],
    }
  }

  get schema() {
    return {
      attrs: {
        textSize: {
          default: "16px",
        },
      },

      content: 'inline*',
      group: 'block',
      draggable: false,
      parseDOM: this.options.textSizes
        .map(t => ({
          tag: `p`,
          attrs: { style: `font-size: `+ t },
        })),
      toDOM: (node) => [ 'p', { style: `font-size: ${node.attrs.textSize}` }, 0 ]
    }
  }

  commands({ type, schema }) {
    return attrs => toggleBlockType(type, schema.nodes.textSize, attrs)
  }


  inputRules({ type }) {
    return this.options.textSizes.map(textSize => textblockTypeInputRule(
      new RegExp(`^(#{1,${textSize}})\\s$`),
      type,
      () => ({ textSize }),
    ))
  }

}


