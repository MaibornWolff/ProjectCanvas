import { JSONContent } from "@tiptap/react";
import { DocNode } from "@atlaskit/adf-schema";
import { WikiMarkupTransformer } from "@atlaskit/editor-wikimarkup-transformer";
import { JSONTransformer } from "@atlaskit/editor-json-transformer";
import { transformToAdf, transformFromAdf } from "@canvas/tiptap/adf-transformer";

const wikiT = new WikiMarkupTransformer();
const jsonT = new JSONTransformer();

export const transformToWiki = (content: JSONContent): string => wikiT.encode(jsonT.parse(transformToAdf(content)));

export const transformFromWiki = (content: string): JSONContent => transformFromAdf(jsonT.encode(wikiT.parse(content)) as DocNode);
