import { Button, Group, Loader, TextInput, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useCanvasStore } from "@canvas/lib/Store";

export function AddSubtask({
  issueKey,
  projectKey,
}: {
  issueKey: string,
  projectKey: string,
}) {
  const queryClient = useQueryClient();
  const [summary, setSummary] = useState("");
  const { issueTypes } = useCanvasStore();
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
      <Tooltip
        label={summary === "" ? "The summary of an issue cannot be empty!" : "No subtask issue type found!"}
        disabled={issueTypeWithSubTask && summary !== ""}
      >
        <Button p="5px" disabled={!issueTypeWithSubTask || summary === ""}>
          <IconPlus onClick={() => subtaskMutation.mutate()} />
        </Button>
      </Tooltip>
      {subtaskMutation.isPending && <Loader size="sm" />}
    </Group>
  );
}
