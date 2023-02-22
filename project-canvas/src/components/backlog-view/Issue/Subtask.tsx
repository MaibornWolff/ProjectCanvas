import { Text, ThemeIcon, Group, Box, Loader } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconBinaryTree2, IconTrash } from "@tabler/icons"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
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
  const [showLoader, setShowLoader] = useState(false)

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
      <ThemeIcon size="sm" sx={{ flex: 2 }}>
        <IconBinaryTree2 />
      </ThemeIcon>
      <Text size="sm" color="blue" span sx={{ flex: 15 }} lineClamp={1}>
        {props.subtaskKey}
      </Text>
      <Box sx={{ flex: 60 }}>
        <IssueSummary
          summary={props.fields.summary}
          issueKey={props.subtaskKey}
        />
      </Box>
      {showLoader && <Loader size="sm" />}
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
          setShowLoader(true)
          deleteIssueSubtask(props.subtaskKey).then(() => {
            showNotification({
              message: `subtask ${props.subtaskKey} has been deleted!`,
              color: "red",
            })
            queryClient
              .invalidateQueries({ queryKey: ["issues"] })
              .then(() => setShowLoader(false))
          })
        }}
      >
        <IconTrash />
      </ThemeIcon>
    </Group>
  )
}
