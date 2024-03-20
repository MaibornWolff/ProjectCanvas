import { Button, Group, Loader, TextInput, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCanvasStore } from "@canvas/lib/Store";
import { Issue } from "@canvas/types";

export function AddSubtaskButton({
  issueKey,
  type,
  projectKey,
}: {
  issueKey: string,
  type: Issue["type"],
  projectKey: string,
}) {
  const queryClient = useQueryClient();
  const [summary, setSummary] = useState("");
  const { issueTypes } = useCanvasStore();
  const currentIssueType = issueTypes?.find((issueType) => issueType?.name === type);
  const issueTypeWithSubTask = issueTypes?.find((issueType) => issueType?.subtask === true);

  const subtaskMutation = useMutation({
    mutationFn: () => window.provider.createSubtask(issueKey, summary, projectKey, issueTypeWithSubTask!.id.toString()),
    onSuccess: (createdSubtaskKey) => {
      setSummary("");
      showNotification({
        message: `The issue ${createdSubtaskKey} has been created!`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  let disabledTooltip;
  if (currentIssueType?.subtask) {
    disabledTooltip = "You cannot create a subtask of a subtask!";
  } else if (!issueTypeWithSubTask) {
    disabledTooltip = "No subtask issue type found! Check your platform configuration.";
  } else if (summary === "") {
    disabledTooltip = "The summary of an issue cannot be empty!";
  }

  return (
    <Group>
      <TextInput
        w="100%"
        mr="sm"
        placeholder="Add Subtask"
        style={{ flex: 10 }}
        onChange={(e) => setSummary(e.target.value)}
        value={summary}
      />
      <Tooltip label={disabledTooltip} disabled={!disabledTooltip}>
        <Button p="5px" disabled={!!disabledTooltip}>
          <IconPlus onClick={() => subtaskMutation.mutate()} />
        </Button>
      </Tooltip>
      {subtaskMutation.isPending && <Loader size="sm" />}
    </Group>
  );
}
