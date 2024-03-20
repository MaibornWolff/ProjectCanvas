import { Accordion, Group, Stack, Text } from "@mantine/core";
import { Issue } from "@canvas/types";
import { AssigneeMenu } from "@canvas/components/DetailView/Components/AssigneeMenu";
import { Labels } from "@canvas/components/DetailView/Components/Labels";
import { IssueSprint } from "@canvas/components/DetailView/Components/IssueSprint";
import { StoryPointsEstimateMenu } from "@canvas/components/DetailView/Components/StoryPointsEstimateMenu";
import { ReporterMenu } from "@canvas/components/DetailView/Components/ReporterMenu";

export function DetailsAccordion({
  issueKey,
  assignee,
  labels,
  sprint,
  type,
  storyPointsEstimate,
  initialOpen,
}: {
  issueKey: string,
  assignee: Issue["assignee"],
  labels: Issue["labels"],
  sprint: Issue["sprint"],
  type: Issue["type"],
  storyPointsEstimate: Issue["storyPointsEstimate"],
  initialOpen?: boolean,
}) {
  return (
    <Accordion variant="contained" defaultValue={initialOpen ? "Details" : undefined}>
      <Accordion.Item value="Details">
        <Accordion.Control style={{ textAlign: "left" }}>Details</Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <AssigneeMenu assignee={assignee} issueKey={issueKey} />
            <Group grow>
              <Text fz="sm" c="dimmed">Labels</Text>
              <Labels labels={labels} issueKey={issueKey} />
            </Group>
            <Group grow>
              <Text fz="sm" c="dimmed">Sprint</Text>
              <IssueSprint sprint={sprint} type={type} issueKey={issueKey} />
            </Group>
            <StoryPointsEstimateMenu issueKey={issueKey} storyPointsEstimate={storyPointsEstimate} />
            <ReporterMenu issueKey={issueKey} />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
