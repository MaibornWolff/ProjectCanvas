import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEffect, useState } from "react";
import { AcceptanceCriteriaList, AcceptanceCriteriaItem, AcceptanceCriteriaControl } from "@canvas/tiptap";
import { useQuery } from "@tanstack/react-query";

export function Description({
  description,
  onChange,
}: {
  description: string,
  onChange: (newDescription: string) => void,
}) {
  const { data } = useQuery({
    queryFn: () => window.provider.supportsProseMirrorPayloads(),
    queryKey: ["supportsProseMirrorPayloads"],
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
      Link,
    ],
    content: `<ul data-type='acceptanceCriteriaList'><li data-type='acceptanceCriteriaItem'>Some default content: ${data ?? false}</li></ul>`,
    // content: description,
    onBlur: ({ editor }) => {
      const currentDescription = editor.getHTML();
      if (lastDescription !== currentDescription) {
        setLastDescription(currentDescription);
        onChange(currentDescription);
      }
    },
  });

  useEffect(() => {
    if (data) {
      tipTapEditor?.commands.setContent(`${data ?? false}`);
    }
  }, [data]);

  return (
    <RichTextEditor editor={tipTapEditor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.OrderedList />
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
