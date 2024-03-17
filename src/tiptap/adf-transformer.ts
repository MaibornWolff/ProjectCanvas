import { JSONContent } from "@tiptap/react";
import { DocNode } from "@atlaskit/adf-schema";
import { ADFEntity, EntityParent, VisitorCollection } from "@atlaskit/adf-utils/types";

/**
 * `traverse` function from `@atlaskit/adf-utils` but slightly restructured to be a post-order depth-first traversal
 */
function traverse(adf: ADFEntity, visitors: VisitorCollection) {
  return traverseNode(adf, { node: undefined }, visitors, 0, 0);
}

function traverseNode(
  adfNode: ADFEntity,
  parent: EntityParent,
  visitors: VisitorCollection,
  index: number,
  depth: number,
): ADFEntity | false {
  const visitor = visitors[adfNode.type] || visitors.any;

  let newNode = { ...adfNode };
  if (newNode.content) {
    newNode.content = newNode.content.reduce<Array<ADFEntity>>(
      (acc, node, idx) => {
        if (!node) {
          return acc;
        }
        const processedNode = traverseNode(
          node,
          { node: newNode, parent },
          visitors,
          idx,
          depth + 1,
        );
        if (processedNode !== false) {
          acc.push(processedNode);
        }
        return acc;
      },
      [],
    );
  }

  if (visitor) {
    const processedNode = visitor({ ...newNode }, parent, index, depth);

    if (processedNode === false) {
      return false;
    }

    newNode = processedNode || adfNode;
  }

  return newNode;
}

const AcceptanceCriteriaMarker = "[AC]";

export const transformToAdf = (content: JSONContent): DocNode => ({
  ...traverse(content as ADFEntity, {
    acceptanceCriteriaList: (node) => ({
      ...node,
      type: "bulletList",
    }),
    acceptanceCriteriaItem: (node) => {
      if (node.content?.[0]?.type !== "paragraph") {
        throw new Error("Encountered item node that does not contain a paragraph as the first item");
      }

      const insertNewNode = node.content[0].content?.[0]?.type !== "text";
      const paragraphContent = node.content[0].content ?? [];
      if (insertNewNode) {
        paragraphContent.unshift({
          type: "text",
          text: AcceptanceCriteriaMarker,
        });
      } else {
        paragraphContent[0]!.text = `${AcceptanceCriteriaMarker} ${paragraphContent[0]!.text}`;
      }

      return {
        ...node,
        type: "listItem",
        content: [
          {
            type: "paragraph",
            content: paragraphContent,
          },
          ...node.content.slice(1),
        ],
      };
    },
  }),
  version: 1,
} as DocNode);

export const transformFromAdf = (content: DocNode): JSONContent => ({
  ...traverse(content as ADFEntity, {
    bulletList: (node) => {
      // This relies on the traversal being "post-order"
      if (node.content?.[0]?.type !== "acceptanceCriteriaItem") {
        return node;
      }

      return {
        ...node,
        type: "acceptanceCriteriaList",
      };
    },
    listItem: (node) => {
      if (node.content?.[0]?.type !== "paragraph") {
        throw new Error("Encountered item node that does not contain a paragraph as the first item");
      }

      const paragraphContent = node.content[0].content;
      if (paragraphContent?.[0]?.type !== "text" || !paragraphContent![0]?.text?.startsWith(AcceptanceCriteriaMarker)) {
        return node;
      }

      paragraphContent![0]!.text = paragraphContent![0]!.text.slice(AcceptanceCriteriaMarker.length + 1);
      if (paragraphContent[0].text === "") {
        paragraphContent.splice(0, 1);
      }

      return {
        ...node,
        type: "acceptanceCriteriaItem",
        content: [
          {
            type: "paragraph",
            content: paragraphContent,
          },
          ...node.content.slice(1),
        ],
      };
    },
  }),
} as JSONContent);
