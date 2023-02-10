import {
  Avatar,
  Badge,
  Center,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core"
import {
  IconBookmark,
  IconBug,
  IconCheck,
  IconQuestionMark,
} from "@tabler/icons"
import { Issue } from "project-extender"
import { Draggable } from "react-beautiful-dnd"

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
}: Issue & { index: number }) {
  let icon: JSX.Element
  let iconGradient1: string
  let iconGradient2: string
  let storyPointsColor: string

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

  switch (type) {
    case "Story":
      icon = <IconBookmark />
      iconGradient1 = "teal"
      iconGradient2 = "lime"
      break
    case "Task":
      icon = <IconCheck />
      iconGradient1 = "teal"
      iconGradient2 = "blue"
      break
    case "Bug":
      icon = <IconBug />
      iconGradient1 = "orange"
      iconGradient2 = "red"
      break
    default:
      icon = <IconQuestionMark />
      iconGradient1 = "white"
      iconGradient2 = "white"
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
              <ThemeIcon
                size="sm"
                variant="gradient"
                gradient={{ from: iconGradient1, to: iconGradient2, deg: 105 }}
              >
                {icon}
              </ThemeIcon>
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
                >
                  {issueKey}
                </Text>
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
