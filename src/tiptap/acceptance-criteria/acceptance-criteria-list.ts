import { mergeAttributes, Node } from "@tiptap/core";

export interface AcceptanceCriteriaListOptions {
  HTMLAttributes: Record<string, unknown>,
  itemTypeName: string,
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    acceptanceCriteriaList: {
      toggleAcceptanceCriteriaList: () => ReturnType,
    },
  }
}

export const AcceptanceCriteriaList = Node.create<AcceptanceCriteriaListOptions>({
  priority: 1000,

  name: "acceptanceCriteriaList",

  addOptions() {
    return {
      HTMLAttributes: {},
      itemTypeName: "acceptanceCriteriaItem",
    };
  },

  content() {
    return `${this.options.itemTypeName}+`;
  },

  group: "block list",

  parseHTML() {
    return [
      {
        tag: `ul[data-type="${this.name}"]`,
        priority: 52,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["ul", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { "data-type": this.name }), 0];
  },

  addCommands() {
    return {
      toggleAcceptanceCriteriaList: () => ({ commands }) => commands.toggleList(this.name, this.options.itemTypeName),
    };
  },
});
