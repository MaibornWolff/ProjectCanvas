import { Box, Group, Loader, Text, ThemeIcon } from "@mantine/core";
import { IconBinaryTree2, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { IssueSummary } from "../IssueSummary";
import { deleteSubtaskMutation } from "./queries";

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
  const deleteSubtask = deleteSubtaskMutation(queryClient);
  return (
    <Group
      align="center"
      key={subtaskKey}
      style={(theme) => ({
        borderRadius: theme.radius.sm,
        transition: "background-color .8s ease-out",
        boxShadow: theme.shadows.xs,
        ":hover": {
          backgroundColor: "#ebecf0",
          transition: "background-color .1s ease-in",
        },
      })}
      p="sm"
    >
      <ThemeIcon size="sm" style={{ flex: 2 }}>
        <IconBinaryTree2 />
      </ThemeIcon>
      <Text size="sm" c="blue" span style={{ flex: 15 }} lineClamp={1}>
        {subtaskKey}
      </Text>
      <Box style={{ flex: 50 }}>
        <IssueSummary summary={fields.summary} issueKey={subtaskKey} />
      </Box>
      {deleteSubtask.isPending && <Loader size="sm" />}
      <ThemeIcon
        variant="outline"
        size="sm"
        color="gray"
        ml="auto"
        style={{
          flex: 2,
          ":hover": { color: "red", borderColor: "red", cursor: "pointer" },
        }}
        onClick={() => {
          deleteSubtask.mutate(subtaskKey);
        }}
      >
        <IconTrash />
      </ThemeIcon>
    </Group>
  );
}
