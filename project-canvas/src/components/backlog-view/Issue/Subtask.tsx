import { Text, ThemeIcon, Grid } from "@mantine/core"
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
    <Grid
      columns={100}
      key={props.id}
      p={5}
      sx={(theme) => ({
        display: "flex",
        borderRadius: theme.radius.sm,
        padding: theme.spacing.xs,
        transition: "background-color .8s ease-out",
        boxShadow: theme.shadows.xs,
        ":hover": {
          backgroundColor: "#ebecf0",
          transition: "background-color .1s ease-in",
        },
      })}
    >
      <Grid.Col span={5}>
        <ThemeIcon size="sm" mt={2}>
          <IconBinaryTree2 />
        </ThemeIcon>
      </Grid.Col>
      <Grid.Col span={10}>
        <Text size="sm" color="blue" span>
          {props.subtaskKey}
        </Text>
      </Grid.Col>
      <Grid.Col span={75}>
        <IssueSummary
          summary={props.fields.summary}
          issueKey={props.subtaskKey}
        />
      </Grid.Col>
      <Grid.Col span={5}>
        <ThemeIcon
          variant="outline"
          size="sm"
          mt={2}
          color="gray"
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
      </Grid.Col>
    </Grid>
  )
}
