import {
  Avatar,
  Badge,
  Center,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core"
import { useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { DetailView } from "./DetailView"
import { IssueIcon } from "./IssueIcon"

export function IssueCard({
  issueKey,
  summary,
  status,
  type,
  storyPointsEstimate,
  epic,
  labels,
  assignee,
  index,
  projectId,
  attachment,
  ...props
}: Issue & { index: number }) {
  let storyPointsColor: string
  const [opened, setOpened] = useState(false)
  const queryClient = useQueryClient()

  switch (status) {
    case "To Do":
      storyPointsColor = "gray.6"
      break
    case "In Progress":
      storyPointsColor = "blue.8"
      break
    case "Done":
      storyPointsColor = "green.9"
      break
    default:
      storyPointsColor = "gray.6"
  }

  return (
    <Draggable key={issueKey} draggableId={issueKey} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Group
            sx={(theme) => ({
              borderRadius: theme.radius.sm,
              gap: 0,
              padding: theme.spacing.xs,
              transition: "background-color .8s ease-out",
              boxShadow: theme.shadows.xs,
              ":hover": {
                backgroundColor: "#ebecf0",
                transition: "background-color .1s ease-in",
              },
            })}
          >
            <Center sx={{ flex: 1, minWidth: "48px" }}>
              <IssueIcon type={type} />
            </Center>

            <Stack spacing={0} sx={{ flex: 12 }}>
              <Group>
                <Text
                  size="sm"
                  color="blue"
                  td={status === "Done" ? "line-through" : "none"}
                  sx={{
                    ":hover": {
                      textDecoration: "underline",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => setOpened(true)}
                >
                  {issueKey}
                </Text>
                <Modal
                  opened={opened}
                  onClose={() => {
                    setOpened(false)
                    queryClient.invalidateQueries({ queryKey: ["issues"] })
                  }}
                  size="85%"
                  withCloseButton={false}
                >
                  <DetailView
                    issueKey={issueKey}
                    summary={summary}
                    status={status}
                    type={type}
                    storyPointsEstimate={storyPointsEstimate}
                    epic={epic}
                    labels={labels}
                    assignee={assignee}
                    projectId={projectId}
                    attachment={attachment}
                    {...props}
                  />
                </Modal>
                {epic && <Badge color="violet">{epic}</Badge>}
                {labels?.length !== 0 &&
                  labels.map((label) => (
                    <Badge key={`${issueKey}-${label}`} color="yellow">
                      {label}
                    </Badge>
                  ))}
              </Group>
              <Text size="lg">{summary}</Text>
              <Group align="center" spacing="sm">
                <Text size="sm">{type}</Text>
                <Text size="sm">•</Text>
                <Text size="sm">{status}</Text>
              </Group>
            </Stack>
            <Tooltip
              label={
                assignee.displayName !== undefined
                  ? assignee.displayName
                  : "unassigned"
              }
            >
              {assignee.avatarUrls !== undefined ? (
                <Avatar
                  src={assignee?.avatarUrls["24x24"]}
                  size="sm"
                  radius="xl"
                  ml={4}
                  mr={4}
                />
              ) : (
                <Avatar radius="xl" />
              )}
            </Tooltip>

            <Badge
              w="24px"
              p="0"
              bg={
                storyPointsEstimate !== undefined &&
                storyPointsEstimate !== null
                  ? storyPointsColor
                  : "transparent"
              }
              variant="filled"
              sx={{ alignSelf: "flex-start" }}
            >
              {storyPointsEstimate}
            </Badge>
          </Group>
        </Paper>
      )}
    </Draggable>
  )
}
