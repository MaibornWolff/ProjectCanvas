import { useEditor } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";
import { useState } from "react";
import {
  AcceptanceCriteriaList,
  AcceptanceCriteriaItem,
  AcceptanceCriteriaControl,
  transformFromAdf,
  transformToAdf,
  transformToWiki,
  transformFromWiki,
} from "@canvas/tiptap";
import { useQuery } from "@tanstack/react-query";
import { DocNode } from "@atlaskit/adf-schema";
import { Issue } from "@canvas/types";

export function Description({
  description,
  onChange,
}: {
  description: Issue["description"] | null,
  onChange: (newDescription: Issue["description"]) => void,
}) {
  const { data: supportsProseMirrorPayloads } = useQuery({
    queryKey: ["supportsProseMirrorPayloads"],
    queryFn: () => window.provider.supportsProseMirrorPayloads(),
  });

  const [lastDescription, setLastDescription] = useState(description);
  const setContentFromDescription = (editor: Editor) => {
    if (description) {
      if (supportsProseMirrorPayloads) {
        editor.commands.setContent(transformFromAdf(description as DocNode));
        setLastDescription(editor.getHTML() ?? "");
      } else {
        editor.commands.setContent(transformFromWiki(description as string));
        setLastDescription(editor.getHTML() ?? "");
      }
    }
  };

  const tipTapEditor = useEditor({
    extensions: [
      StarterKit,
      AcceptanceCriteriaList,
      AcceptanceCriteriaItem.configure({
        HTMLAttributes: {
          style: "color: green",
        },
      }),
    ],
    content: null,
    onBlur: ({ editor }) => {
      const currentDescription = editor.getHTML();
      if (lastDescription !== currentDescription) {
        setLastDescription(currentDescription);
        onChange(supportsProseMirrorPayloads ? transformToAdf(editor.getJSON()) : transformToWiki(editor.getJSON()));
      }
    },
    onCreate: ({ editor }) => {
      setContentFromDescription(editor);
    },
  }, [supportsProseMirrorPayloads]);

  return (
    <RichTextEditor editor={tipTapEditor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <AcceptanceCriteriaControl />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
