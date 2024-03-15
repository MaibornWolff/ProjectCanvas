import { useRichTextEditorContext, RichTextEditor } from "@mantine/tiptap";
import { IconSquareCheck } from "@tabler/icons-react";

export function AcceptanceCriteriaControl() {
  const { editor } = useRichTextEditorContext();

  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor.Control
      onClick={() => {
        console.log("PRESSED THE BUTTON!");
        editor.chain().focus().toggleAcceptanceCriteriaList();
      }}
      aria-label="Toggle acceptance criteria"
      title="Toggle acceptance criteria"
      className={editor.isActive("acceptanceCriteriaList") ? "is-active" : ""}
    >
      <IconSquareCheck stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
}
