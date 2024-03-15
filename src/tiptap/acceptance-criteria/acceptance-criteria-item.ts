import { mergeAttributes, Node } from "@tiptap/core";

export interface AcceptanceCriteriaItemOptions {
  HTMLAttributes: Record<string, unknown>,
}

export const AcceptanceCriteriaItem = Node.create<AcceptanceCriteriaItemOptions>({
  priority: 1000,

  name: "acceptanceCriteriaItem",

  addOptions() {
    return {
      HTMLAttributes: {
        "data-acceptance-criteria-item": true,
        style: "color: blue",
      },
    };
  },

  content: "inline*",

  parseHTML() {
    return [
      {
        tag: "li",
        getAttrs: (node) => (node as HTMLElement).getAttribute("data-acceptance-criteria-item") === "true" && null,
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
});
