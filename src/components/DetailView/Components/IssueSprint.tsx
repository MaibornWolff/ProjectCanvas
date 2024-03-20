import { Text, Box, Select } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Issue, Sprint } from "types";
import { useState } from "react";
import { useCanvasStore } from "@canvas/lib/Store";
import classes from "./IssueSprint.module.css";

export function IssueSprint(props: {
  sprint: Sprint | undefined,
  issueKey: string,
  type: string,
}) {
  const [defaultSprint, setDefaultSprint] = useState(props.sprint || undefined);
  const [showSprintInput, setShowSprintInput] = useState(false);

  const { selectedProjectBoardIds: boardIds, getIssueTypeFromName } = useCanvasStore();
  const isSubtaskIssueType = getIssueTypeFromName(props.type)?.subtask;
  const currentBoardId = boardIds[0];
  const { data: sprints } = useQuery({
    queryKey: ["sprints"],
    queryFn: () => window.provider.getSprints(currentBoardId),
    enabled: !!currentBoardId,
  });

  const mutationSprint = useMutation({
    mutationFn: (issue: Issue) => window.provider.editIssue(issue, props.issueKey),
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
    mutationFn: () => window.provider.moveIssueToBacklog(props.issueKey),
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
      {showSprintInput && !isSubtaskIssueType ? (
        <Select
          nothingFoundMessage="No Options"
          searchable
          clearable
          defaultValue={props.sprint ? props.sprint.name : ""}
          data={sprintNames}
          onBlur={() => {
            setShowSprintInput(false);
            if (defaultSprint) {
              mutationSprint.mutate({ sprint: defaultSprint } as Issue);
            } else mutationBacklog.mutate();
          }}
          onChange={(value) => {
            if (value === "") setDefaultSprint(undefined);
            else setDefaultSprint(sprints?.find((sprint) => sprint.name === value)!);
          }}
        />
      ) : (
        <Box onClick={() => setShowSprintInput(true)} className={classes.root} data-enabled={!isSubtaskIssueType}>
          {defaultSprint ? (<Text>{defaultSprint.name}</Text>) : (<Text c="dimmed">None</Text>)}
        </Box>
      )}
    </span>
  );
}
