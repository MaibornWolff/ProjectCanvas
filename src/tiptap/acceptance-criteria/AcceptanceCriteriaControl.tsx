import { useRichTextEditorContext, RichTextEditor } from "@mantine/tiptap";
import { IconAcceptanceCriteria } from "@canvas/tiptap/acceptance-criteria/acceptance-criteria-icon";

export function AcceptanceCriteriaControl() {
  const { editor } = useRichTextEditorContext();

  if (!editor) {
    return null;
  }

  return (
    <RichTextEditor.Control
      onClick={() => editor.chain().focus().toggleAcceptanceCriteriaList().run()}
      aria-label="Toggle acceptance criteria"
      title="Toggle acceptance criteria"
      active={editor.isActive("acceptanceCriteriaList")}
    >
      <IconAcceptanceCriteria stroke={1.0} size="1.5rem" />
    </RichTextEditor.Control>
  );
}
