import { Center, Group, Loader, Modal, Paper, Button, Text } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { Issue } from "../../../../../types";
import { SplitIssueDetails } from "./SplitIssueDetails";
import { SplitIssueCreate } from "./SplitIssueCreate";
import { isNewIssueIdentifier } from "./split-view-constants";
import { getIssuesByProject } from "../../../BacklogView/helpers/queryFetchers";
import { useCanvasStore } from "../../../../lib/Store";
import { editIssue } from "../../helpers/queryFunctions";

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

  const [modifiedDescriptions, setModifiedDescriptions] = useState<{ [key: string]: string | undefined }>(
    {},
  );
  const setModifiedDescription = (issueKey: string, newDescription: string | undefined) => {
    setModifiedDescriptions({
      ...modifiedDescriptions,
      [issueKey]: newDescription,
    });
  };
  const saveButtonEnabled = Object.values(modifiedDescriptions).filter((x) => !!x).length > 0;

  const mutateDescriptions = useMutation({
    mutationFn: () => Promise.all(
      Object.keys(modifiedDescriptions)
        .filter((x) => !!x)
        .map(async (issueKey: string) => {
          await editIssue(
            { description: modifiedDescriptions[issueKey] } as Issue,
            issueKey,
          );
        }),
    ),
    onError: () => {
      showNotification({
        message: "An error occurred while modifing the Description 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      const issueKeys = Object.keys(modifiedDescriptions).join(", ");
      showNotification({
        message: `Description of the following issues has been modified: ${issueKeys}!`,
        color: "green",
      });
      setModifiedDescriptions({});
    },
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
          description={modifiedDescriptions[issueKey] ?? issues[issueKey].description}
          onIssueSelected={onIssueSelected}
          onIssueDescriptionChanged={(newDescription) => {
            setModifiedDescription(
              issueKey,
              newDescription === issues[issueKey].description
                || (!newDescription && !issues[issueKey].description)
                ? undefined : newDescription,
            );
          }}
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
          <Button
            c="div"
            color="primaryBlue"
            disabled={!saveButtonEnabled}
            onClick={() => {
              mutateDescriptions.mutate();
            }}
          >
            <IconDeviceFloppy />
          </Button>
          <Button c="div" variant="transparent" color="red" pl="0" onClick={() => onClose()}>
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
