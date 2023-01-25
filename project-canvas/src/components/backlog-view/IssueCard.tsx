import { Issue } from "project-extender"
import { Box, Flex, Stack, Text, ThemeIcon } from "@mantine/core"
import {
  IconBookmark,
  IconCheck,
  IconBug,
  IconQuestionMark,
} from "@tabler/icons"
import { Draggable } from "react-beautiful-dnd"

export function IssueCard({
  issueKey,
  summary,
  index,
  status,
  type,
  storyPoints,
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
  let issueKeyElement: JSX.Element
  if (status === "Done") {
    issueKeyElement = (
      <Text
        color="blue"
        ml={5}
        sx={{
          textDecoration: "line-through",
          ":hover": {
            textDecoration: "underline",
            cursor: "pointer",
          },
        }}
      >
        {issueKey}
      </Text>
    )
  } else {
    issueKeyElement = (
      <Text
        color="blue"
        ml={5}
        sx={{
          ":hover": {
            textDecoration: "underline",
            cursor: "pointer",
          },
        }}
      >
        {issueKey}
      </Text>
    )
  }
  return (
    <Draggable draggableId={issueKey} index={index}>
      {(provided) => (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            padding: "5px",
            transition: "background-color .8s ease-out",
            margin: 8,
            boxShadow:
              "0 0 1px 0 rgb(9 30 66 / 31%), 0 2px 4px -1px rgb(9 30 66 / 25%)",

            ":hover": {
              backgroundColor: "#ebecf0",
              transition: "background-color .1s ease-in",
            },
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Stack spacing={0}>
            <Flex
              h={22}
              m={5}
              sx={{
                alignItems: "center",
              }}
            >
              <ThemeIcon
                size="lg"
                variant="gradient"
                gradient={{ from: iconGradient1, to: iconGradient2, deg: 105 }}
                sx={{
                  width: "16px",
                  height: "16px",
                  minHeight: "16px",
                  minWidth: "16px",
                }}
              >
                {icon}
              </ThemeIcon>
              {issueKeyElement}
              <Text ml={10} sx={{ flex: "1" }}>
                {summary}
              </Text>
              {storyPoints && (
                <Text
                  h="1.2em"
                  w="2.5em"
                  bg="rgba(9,30,66,0.13)"
                  m={0}
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "10px",
                  }}
                >
                  {storyPoints}
                </Text>
              )}
            </Flex>
            <Flex
              h={22}
              ml={27}
              sx={{
                alignItems: "center",
              }}
            >
              <Text>{type}</Text>
              <Text m={10}>•</Text>
              <Text ml={5}>{status}</Text>
            </Flex>
          </Stack>
        </Box>
      )}
    </Draggable>
  )
}
