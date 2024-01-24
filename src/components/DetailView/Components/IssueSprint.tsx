import {
  Text, Box, Select, useMantineTheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Issue, Sprint } from "types";
import { useState } from "react";
import { useCanvasStore } from "../../../lib/Store";
import {
  getSprints,
  moveIssueToBacklog,
} from "../../CreateIssue/queryFunctions";
import { editIssue } from "../helpers/queryFunctions";

export function IssueSprint(props: {
  sprint: Sprint | undefined;
  issueKey: string;
}) {
  const theme = useMantineTheme();
  const [defaultSprint, setDefaultSprint] = useState(props.sprint || undefined);
  const [showSprintInput, setShowSprintInput] = useState(false);

  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds);
  const currentBoardId = boardIds[0];
  const { data: sprints } = useQuery({
    queryKey: ["sprints"],
    queryFn: () => getSprints(currentBoardId),
    enabled: !!currentBoardId,
  });

  const mutationSprint = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, props.issueKey),
    onError: () => {
      showNotification({
        message: "An error occurred while modifing the sprint 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: `The sprint for issue ${props.issueKey} has been modified!`,
        color: "green",
      });
    },
  });
  const mutationBacklog = useMutation({
    mutationFn: () => moveIssueToBacklog(props.issueKey),
    onError: () => {
      showNotification({
        message: "An error occurred while modifing the sprint 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: `The sprint for issue ${props.issueKey} has been modified!`,
        color: "green",
      });
    },
  });
  const sprintNames = sprints ? sprints?.map((sprint) => sprint.name) : [];
  return (
    <span>
      {showSprintInput ? (
        <Select
          nothingFoundMessage="No Options"
          searchable
          clearable
          defaultValue={props.sprint ? props.sprint.name : ""}
          data={sprintNames}
          onBlur={() => {
            setShowSprintInput(false);
            if (defaultSprint) {
              mutationSprint.mutate({
                sprint: defaultSprint,
              } as Issue);
            } else mutationBacklog.mutate();
          }}
          onChange={(value) => {
            if (value === "") setDefaultSprint(undefined);
            else {
              setDefaultSprint(
                sprints?.find((sprint) => sprint.name === value)!,
              );
            }
          }}
        />
      ) : (
        <Box
          onClick={() => setShowSprintInput(true)}
          style={{
            ":hover": {
              cursor: "pointer",
              boxShadow: theme.shadows.xs,
              borderRadius: theme.radius.xs,
              transition: "background-color .8s ease-out",
            },
          }}
        >
          {defaultSprint ? (
            <Text>{defaultSprint.name}</Text>
          ) : (
            <Text c="dimmed">None</Text>
          )}
        </Box>
      )}
    </span>
  );
}
