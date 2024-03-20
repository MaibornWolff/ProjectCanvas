import { Accordion } from "@mantine/core";
import { Issue } from "@canvas/types";
import { Attachments } from "./Attachments";

export function AttachmentsAccordion({
  issueKey,
  attachments,
  initialOpen,
}: {
  issueKey: string,
  attachments: Issue["attachments"],
  initialOpen?: boolean,
}) {
  return (
    <Accordion variant="contained" defaultValue={initialOpen ? "Attachments" : undefined}>
      <Accordion.Item value="Attachments">
        <Accordion.Control style={{ textAlign: "left" }}>Attachments</Accordion.Control>
        <Accordion.Panel>
          <Attachments issueKey={issueKey} attachments={attachments} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
