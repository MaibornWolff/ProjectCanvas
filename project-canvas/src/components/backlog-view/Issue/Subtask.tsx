import { Text, ThemeIcon, Group } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconBinaryTree2, IconTrash } from "@tabler/icons"
import { useQueryClient } from "@tanstack/react-query"
import { deleteIssueSubtask } from "../../CreateIssue/queryFunctions"
import { IssueSummary } from "./IssueSummary"

export function Subtask(props: {
  id: string
  subtaskKey: string
  fields: {
    summary: string
  }
}) {
  const queryClient = useQueryClient()

  return (
    <Group
      align="center"
      key={props.id}
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
      <ThemeIcon size="sm">
        <IconBinaryTree2 />
      </ThemeIcon>
      <Text size="sm" color="blue" span>
        {props.subtaskKey}
      </Text>
      <IssueSummary
        summary={props.fields.summary}
        issueKey={props.subtaskKey}
      />
      <ThemeIcon
        variant="outline"
        size="sm"
        color="gray"
        ml="auto"
        sx={{
          ":hover": { color: "red", borderColor: "red", cursor: "pointer" },
        }}
        onClick={() => {
          deleteIssueSubtask(props.subtaskKey).then(() => {
            showNotification({
              message: `subtask ${props.subtaskKey} has been deleted!`,
              color: "red",
            })
            queryClient.invalidateQueries({ queryKey: ["issues"] })
          })
        }}
      >
        <IconTrash />
      </ThemeIcon>
    </Group>
  )
}
