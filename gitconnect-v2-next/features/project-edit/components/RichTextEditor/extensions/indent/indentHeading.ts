import {
  CommandProps,
  Extension,
  Extensions,
  isList,
  KeyboardShortcutCommand,
} from '@tiptap/core'
import { TextSelection, Transaction } from 'prosemirror-state'
import Heading from "@tiptap/extension-heading";
import { Command } from '@tiptap/core';
import { Node, nodeInputRule, textblockTypeInputRule } from '@tiptap/react'

// READ MORE HERE: https://github.com/ueberdosis/tiptap/issues/1036#issuecomment-1000983233

// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     indent: {
//       indent: () => ReturnType
//       outdent: () => ReturnType
//     }
//   }
// }

Heading.extend({
  addCommands() {
    const { options, name, editor } = this
    return {
      setHeading: (attributes) => ({ commands }) => {
        if (!options.levels.includes(attributes.level)) {
          return false
        }
        if (editor.state.selection.$head.node().attrs.indent) {
          return commands.setNode(name, {
            ...attributes,
            indent: editor.state.selection.$head.node().attrs.indent,
          })
        }
        return commands.setNode(name, attributes)
      },
      toggleHeading: (attributes) => ({ commands }) => {
        if (!options.levels.includes(attributes.level)) {
          return false
        }

        if (editor.state.selection.$head.node().attrs.indent) {
          return commands.toggleNode(name, 'paragraph', {
            ...attributes,
            indent: editor.state.selection.$head.node().attrs.indent,
          })
        }
        return commands.toggleNode(name, 'paragraph', attributes)
      },
    }
  },
  addInputRules() {
    const { options, type, editor } = this
    // return options.levels.map((level: Level) => {
    return options.levels.map((level: any) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{1,${level}})\\s$`),
        type,
        getAttributes: () => ({
          level,
          indent: editor.state.selection.$head.node().attrs.indent,
        }),
      })
    })
  },
})