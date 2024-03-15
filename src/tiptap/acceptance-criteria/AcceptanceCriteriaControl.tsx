import { useRichTextEditorContext, RichTextEditor } from "@mantine/tiptap";
import { IconSquareCheck } from "@tabler/icons-react";

export function AcceptanceCriteriaControl() {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor?.commands.toggleAcceptanceCriteriaList()}
      aria-label="Toggle acceptance criteria"
      title="Toggle acceptance criteria"
    >
      <IconSquareCheck stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
}
