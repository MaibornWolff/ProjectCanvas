import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";
import { useEffect, useState } from "react";
import { AcceptanceCriteriaList, AcceptanceCriteriaItem, AcceptanceCriteriaControl } from "@canvas/tiptap";
import { useQuery } from "@tanstack/react-query";
import { DocNode } from "@atlaskit/adf-schema";
import { transformFromAdf, transformToAdf } from "@canvas/tiptap/adf-transformer";
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
    content: supportsProseMirrorPayloads && description ? transformFromAdf(description as DocNode) : description as string | null,
    onBlur: ({ editor }) => {
      const currentDescription = editor.getHTML();
      if (lastDescription !== currentDescription) {
        setLastDescription(currentDescription);
        onChange(supportsProseMirrorPayloads ? transformToAdf(editor.getJSON()) : currentDescription);
      }
    },
  });

  useEffect(() => {
    if (supportsProseMirrorPayloads && description) {
      const adfDescription = transformFromAdf(description as DocNode);
      tipTapEditor?.commands.setContent(adfDescription);
      setLastDescription(tipTapEditor?.getHTML() ?? "");
    }
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
