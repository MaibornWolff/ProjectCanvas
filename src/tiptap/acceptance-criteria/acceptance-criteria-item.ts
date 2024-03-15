import { mergeAttributes, Node, wrappingInputRule } from "@tiptap/core";

export interface AcceptanceCriteriaItemOptions {
  HTMLAttributes: Record<string, unknown>,
}

export const inputRegex = /^\s*(\[(AC)\])\s$/;

export const AcceptanceCriteriaItem = Node.create<AcceptanceCriteriaItemOptions>({
  priority: 1000,

  name: "acceptanceCriteriaItem",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: "paragraph+",

  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["li", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ];
  },
});
