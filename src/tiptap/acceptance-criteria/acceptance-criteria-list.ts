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
      HTMLAttributes: {
        "data-acceptance-criteria-list": true,
      },
      itemTypeName: "acceptanceCriteriaItem",
    };
  },

  content() {
    return `${this.options.itemTypeName}+`;
  },

  group: "block list",

  defining: true,

  parseHTML() {
    return [
      {
        tag: "ul",
        getAttrs: (node) => (node as HTMLElement).getAttribute("data-acceptance-criteria-list") === "true" && null,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["ul", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleAcceptanceCriteriaList: () => ({ commands }) => commands.toggleList(
        this.name,
        this.options.itemTypeName,
        false,
      ),
    };
  },

  // TODO use addInputRules to add auto format on some regex
});
