import {
  Badge,
  Center,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
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
  index,
  status,
  type,
  storyPointsEstimate,
}: Issue) {
  let icon: JSX.Element
  let iconGradient1: string
  let iconGradient2: string
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
              boxShadow:
                "0 0 1px 0 rgb(9 30 66 / 31%), 0 2px 4px -1px rgb(9 30 66 / 25%)",
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

              <Text size="lg">{summary}</Text>

              <Group align="center" spacing="sm">
                <Text size="sm">{type}</Text>
                <Text size="sm">•</Text>
                <Text size="sm">{status}</Text>
              </Group>
            </Stack>

            {storyPointsEstimate && (
              <Badge
                size="sm"
                px="6px"
                color="gray.6"
                variant="filled"
                sx={{ alignSelf: "flex-start" }}
              >
                {storyPointsEstimate}
              </Badge>
            )}
          </Group>
        </Paper>
      )}
    </Draggable>
  )
}