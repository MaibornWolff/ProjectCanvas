import { Box, Button, Divider, Flex, ScrollArea, Stack } from "@mantine/core"
import { useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"
import { Issue } from "types"
import { CreateIssueModal } from "../../CreateIssue/CreateIssueModal"
import { onDragEnd } from "../../BacklogView/helpers/draggingHelpers"
import { ChildIssueWrapper } from "./ChildIssueWrapper"

export function ChildIssues({ issues }: { issues: Issue[] }) {
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false)

  const [issuesWrappers, setIssuesWrappers] = useState(
    new Map<string, { issues: Issue[] }>()
  )
  const updateIssuesWrapper = (key: string, value: { issues: Issue[] }) => {
    setIssuesWrappers((map) => new Map(map.set(key, value)))
  }

  return (
    <Stack
      sx={{
        minHeight: "100%",
        alignItems: "center",
      }}
    >
      <Flex sx={{ flexGrow: 1 }}>
        <DragDropContext
          onDragEnd={(dropResult) =>
            onDragEnd({
              ...dropResult,
              issuesWrappers,
              updateIssuesWrapper,
            })
          }
        >
          <ScrollArea
            className="left-panel"
            p="sm"
            sx={{
              minWidth: "260px",
              height: 250,
            }}
          >
            <Box mr="md">
              <ChildIssueWrapper id="childIssues" issues={issues} />
            </Box>
            <Box mr="xs">
              <Button
                mt="sm"
                mb="xl"
                variant="subtle"
                color="gray"
                radius="sm"
                display="flex"
                fullWidth
                onClick={() => setCreateIssueModalOpened(true)}
                sx={(theme) => ({
                  justifyContent: "left",
                  ":hover": {
                    background:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[4]
                        : theme.colors.gray[4],
                  },
                })}
              >
                + Create Issue
              </Button>
            </Box>
            <CreateIssueModal
              opened={createIssueModalOpened}
              setOpened={setCreateIssueModalOpened}
            />
          </ScrollArea>
          <Divider
            mr="xs"
            size="xl"
            sx={{
              cursor: "col-resize",
            }}
          />
        </DragDropContext>
      </Flex>
    </Stack>
  )
}
