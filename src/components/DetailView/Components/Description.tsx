import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useState } from "react";
import { AcceptanceCriteriaList, AcceptanceCriteriaItem, AcceptanceCriteriaControl } from "@canvas/tiptap";

export function Description({
  description,
  onChange,
}: {
  description: string,
  onChange: (newDescription: string) => void,
}) {
  const [lastDescription, setLastDescription] = useState(description);
  const tipTapEditor = useEditor({
    extensions: [
      StarterKit,
      AcceptanceCriteriaList,
      AcceptanceCriteriaItem,
      Link,
    ],
    content: "<ul data-acceptance-criteria-list='true'><li data-acceptance-criteria-item='true'>Some default content</li></ul>",
    onBlur: ({ editor }) => {
      const currentDescription = editor.getText();
      if (lastDescription !== currentDescription) {
        setLastDescription(currentDescription);
        onChange(currentDescription);
      }
    },
  });

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
