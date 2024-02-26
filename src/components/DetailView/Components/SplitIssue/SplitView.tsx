import { Center, Group, Loader, Modal, Paper, Button, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { Issue } from "../../../../../types";
import { SplitIssueDetails } from "./SplitIssueDetails";
import { SplitIssueCreate } from "./SplitIssueCreate";
import { isNewIssueIdentifier } from "./split-view-constants";
import { getIssuesByProject } from "../../../BacklogView/helpers/queryFetchers";
import { useCanvasStore } from "../../../../lib/Store";

export function SplitView({
  onIssueSelected,
  opened,
  onClose,
  onCreate,
  selectedSplitIssues,
}: {
  onIssueSelected: (issueKey: string) => void,
  opened: boolean,
  onClose: () => void,
  onCreate: (newIssueKey: string, previousNewIssueIdentifier: string) => void,
  selectedSplitIssues: string[],
}) {
  const { selectedProject: project, selectedProjectBoardIds: boardIds } = useCanvasStore();
  const { data: issues } = useQuery({
    queryKey: ["issues", project?.key],
    queryFn: () => getIssuesByProject(project!.key, boardIds[0]),
    enabled: !!project?.key,
    select: (fetchedIssues: Issue[]) => Object.fromEntries(fetchedIssues.map((s) => [s.issueKey, s])),
    initialData: [],
  });

  function getContentForSplitIssue(issueKey: string) {
    if (isNewIssueIdentifier(issueKey)) {
      return (
        <SplitIssueCreate
          onCreate={(newIssueKey: string) => {
            onCreate(newIssueKey, issueKey);
          }}
        />
      );
    }

    if (issues[issueKey] !== undefined) {
      return (
        <SplitIssueDetails
          {...issues[issueKey]}
          onIssueSelected={onIssueSelected}
          selectedSplitIssues={selectedSplitIssues}
        />
      );
    }

    return (
      <Paper p="xs" h="100%">
        <Center h="100%">
          <Loader />
        </Center>
      </Paper>
    );
  }

  return (
    <Modal
      opened={opened}
      centered
      onClose={onClose}
      withCloseButton={false}
      size="90vw"
    >
      <Group mb="sm" justify="space-between">
        <Text>Split-View</Text>

        <Group>
          <Button c="div" color="primaryBlue">
            <IconDeviceFloppy />
          </Button>
          <Button c="div" variant="transparent" color="red" pl="0">
            <IconX />
          </Button>
        </Group>
      </Group>
      <Group style={{ alignItems: "stretch" }}>
        {selectedSplitIssues.map((issueKey) => (
          <Paper withBorder style={{ flex: 1 }} key={issueKey}>
            {getContentForSplitIssue(issueKey)}
          </Paper>
        ))}
      </Group>
    </Modal>
  );
}
