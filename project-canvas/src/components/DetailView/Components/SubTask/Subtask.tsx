import { Box, Group, Loader, Text, ThemeIcon } from "@mantine/core"
import { IconBinaryTree2, IconTrash } from "@tabler/icons"
import { useQueryClient } from "@tanstack/react-query"
import { IssueSummary } from "../IssueSummary"
import { deleteSubtaskMutation } from "./queries"

export function Subtask({
  id,
  subtaskKey,
  fields,
}: {
  id: string
  subtaskKey: string
  fields: {
    summary: string
  }
}) {
  const queryClient = useQueryClient()
  const deleteSubtask = deleteSubtaskMutation(queryClient)
  return (
    <Group
      align="center"
      key={id}
      sx={(theme) => ({
        borderRadius: theme.radius.sm,
        transition: "background-color .8s ease-out",
        boxShadow: theme.shadows.xs,
        ":hover": {
          backgroundColor: "#ebecf0",
          transition: "background-color .1s ease-in",
        },
      })}
    >
      <ThemeIcon size="sm" sx={{ flex: 2 }}>
        <IconBinaryTree2 />
      </ThemeIcon>
      <Text size="sm" color="blue" span sx={{ flex: 15 }} lineClamp={1}>
        {subtaskKey}
      </Text>
      <Box sx={{ flex: 60 }}>
        <IssueSummary summary={fields.summary} issueKey={subtaskKey} />
      </Box>
      {deleteSubtask.isLoading && <Loader size="sm" />}
      <ThemeIcon
        variant="outline"
        size="sm"
        color="gray"
        ml="auto"
        sx={{
          flex: 2,
          ":hover": { color: "red", borderColor: "red", cursor: "pointer" },
        }}
        onClick={() => {
          deleteSubtask.mutate(subtaskKey)
        }}
      >
        <IconTrash />
      </ThemeIcon>
    </Group>
  )
}
