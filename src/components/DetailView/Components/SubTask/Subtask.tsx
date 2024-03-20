import { Box, Group, Loader, Text, ThemeIcon } from "@mantine/core";
import { IconBinaryTree2, IconTrash } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import { IssueSummary } from "../IssueSummary";
import classes from "./Subtask.module.css";

export function Subtask({
  subtaskKey,
  fields,
}: {
  subtaskKey: string,
  fields: {
    summary: string,
  },
}) {
  const queryClient = useQueryClient();
  const deleteSubtask = useMutation({
    mutationFn: () => window.provider.deleteIssue(subtaskKey),
    onError: () => {
      showNotification({
        message: "The subtask couldn't be deleted! 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: "Subtask  has been deleted!",
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  return (
    <Group align="center" key={subtaskKey} className={classes.root} p="sm">
      <ThemeIcon size="sm" style={{ flex: 2 }}><IconBinaryTree2 /></ThemeIcon>
      <Text size="sm" c="blue" span style={{ flex: 15 }} lineClamp={1}>{subtaskKey}</Text>
      <Box style={{ flex: 50 }}>
        <IssueSummary summary={fields.summary} issueKey={subtaskKey} />
      </Box>
      {deleteSubtask.isPending && <Loader size="sm" />}
      <ThemeIcon
        variant="outline"
        size="sm"
        color="gray"
        ml="auto"
        className={classes.deleteIcon}
        onClick={() => deleteSubtask.mutate()}
      >
        <IconTrash />
      </ThemeIcon>
    </Group>
  );
}
