import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";
import { useState } from "react";

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
    ],
    content: description,
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
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
