import { Issue } from "project-extender"
import { Box, Stack, Text, ThemeIcon } from "@mantine/core"
import { IconBookmark, IconCheck, IconBug } from "@tabler/icons"
import { Draggable } from "react-beautiful-dnd"

export function Item({
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
          <Stack sx={{ gap: "0px" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "22px",
                margin: "5px",
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
              <Text ml={10} sx={{ flex: "1" }}>
                {summary}
              </Text>
              {storyPoints && (
                <Text
                  sx={{
                    height: "1.2em",
                    width: "2.5em",
                    backgroundColor: "rgba(9,30,66,0.13)",
                    margin: "0px",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "10px",
                  }}
                >
                  {storyPoints}
                </Text>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "22px",
                marginLeft: "27px",
              }}
            >
              <Text>{type}</Text>
              <Text m={10}>•</Text>
              <Text ml={5}>{status}</Text>
            </Box>
          </Stack>
        </Box>
      )}
    </Draggable>
  )
}
