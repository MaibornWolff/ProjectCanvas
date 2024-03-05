import { Center, Group, Loader, Modal, Paper, Button, Text, Box, ActionIcon } from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IconArrowsRightLeft, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { showNotification } from "@mantine/notifications";
import { Issue } from "@canvas/types";
import { useCanvasStore } from "@canvas/lib/Store";
import { SplitIssueDetails } from "./SplitIssueDetails";
import { SplitIssueCreate } from "./SplitIssueCreate";
import { isNewIssueIdentifier } from "./split-view-constants";
import { getIssuesByProject } from "../../../BacklogView/helpers/queryFetchers";
import { editIssue } from "../../helpers/queryFunctions";
import { CloseWarningAlert } from "./CloseWarningAlert";

export function SplitView({
  onIssueSelected,
  onIssuesSwapped,
  opened,
  onClose,
  onIssueClose,
  onCreate,
  selectedSplitIssues,
}: {
  onIssueSelected: (issueKey: string) => void,
  onIssuesSwapped: (firstIssueKey: string, secondIssueKey: string) => void,
  opened: boolean,
  onClose: () => void,
  onIssueClose: (issueKey: string) => void,
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
  const [closeWarningModalOpened, setCloseWarningModalOpened] = useState(false);

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
      const issueKeys = Object.keys(modifiedDescriptions)
        .filter((x) => !!modifiedDescriptions[x])
        .join(", ");
      showNotification({
        message: `Description of the following issues has been modified: ${issueKeys}!`,
        color: "green",
      });
      setModifiedDescriptions({});
    },
  });

  const mutateDescription = useMutation({
    mutationFn: (issueKey: string) => editIssue(
      { description: modifiedDescriptions[issueKey] } as Issue,
      issueKey,
    ),
    onError: () => {
      showNotification({
        message: "An error occurred while modifing the Description 😢",
        color: "red",
      });
    },
    onSuccess: (_, issueKey) => {
      showNotification({
        message: `Description of the issue ${issueKey} has been modified!`,
        color: "green",
      });
      setModifiedDescription(issueKey, undefined);
    },
  });

  function getContentForSplitIssue(issueKey: string) {
    if (isNewIssueIdentifier(issueKey)) {
      return (
        <SplitIssueCreate
          onCreate={(newIssueKey: string) => onCreate(newIssueKey, issueKey)}
          onCancel={() => onIssueClose(issueKey)}
        />
      );
    }

    if (issues[issueKey] !== undefined) {
      return (
        <SplitIssueDetails
          {...issues[issueKey]}
          description={modifiedDescriptions[issueKey] ?? issues[issueKey].description}
          originalIssueDescription={issues[issueKey].description}
          onIssueSelected={onIssueSelected}
          onIssueClosed={() => onIssueClose(issueKey)}
          onIssueSaved={() => mutateDescription.mutate(issueKey)}
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

  function tryClose() {
    if (!saveButtonEnabled) {
      onClose();
    } else {
      setCloseWarningModalOpened(!closeWarningModalOpened);
    }
  }

  return (
    <Modal
      opened={opened}
      centered
      onClose={() => tryClose()}
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
          <Button
            c="div"
            variant="transparent"
            color="red"
            pl="0"
            onClick={() => tryClose()}
          >
            <IconX />
          </Button>
          <Modal
            opened={closeWarningModalOpened}
            centered
            onClose={() => setCloseWarningModalOpened(false)}
            withCloseButton={false}
            size={500}
          >
            <CloseWarningAlert
              cancelAlert={() => setCloseWarningModalOpened(false)}
              confirmAlert={() => {
                setCloseWarningModalOpened(false);
                onClose();
              }}
            />
          </Modal>
        </Group>
      </Group>
      <Group style={{ alignItems: "stretch" }}>
        {selectedSplitIssues.map((issueKey) => (
          <Box pos="relative" style={{ flex: 1 }} h="80vh" key={issueKey}>
            <Paper withBorder h="100%">
              {getContentForSplitIssue(issueKey)}
            </Paper>
            {(selectedSplitIssues.indexOf(issueKey) !== selectedSplitIssues.length - 1) ? (
              <ActionIcon
                style={{ position: "absolute", right: "-27px", top: "50%", zIndex: 1000, width: "40px" }}
                c="div"
                color="gray"
                variant="filled"
                radius="lg"
                onClick={() => {
                  const currentIndex = selectedSplitIssues.indexOf(issueKey);
                  onIssuesSwapped(selectedSplitIssues[currentIndex], selectedSplitIssues[currentIndex + 1]);
                }}
              >
                <IconArrowsRightLeft />
              </ActionIcon>
            ) : undefined}
          </Box>
        ))}
      </Group>
    </Modal>
  );
}
