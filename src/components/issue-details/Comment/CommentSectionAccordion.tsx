import { Accordion } from "@mantine/core";
import { Issue } from "@canvas/types";
import { CommentSection } from "./CommentSection";

export function CommentSectionAccordion({
  issueKey,
  comment,
  initialOpen,
}: {
  issueKey: string,
  comment: Issue["comment"],
  initialOpen?: boolean,
}) {
  return (
    <Accordion variant="contained" defaultValue={initialOpen ? "Comments" : undefined}>
      <Accordion.Item value="Comments">
        <Accordion.Control style={{ textAlign: "left" }}>Comments</Accordion.Control>
        <Accordion.Panel>
          <CommentSection issueKey={issueKey} comment={comment} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
