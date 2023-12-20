import { Box, Button, Divider, ScrollArea, Stack } from "@mantine/core"
import { useState } from "react"
import { Issue } from "../../../../../types"
import { CreateIssueModal } from "../../../CreateIssue/CreateIssueModal"
import { ChildIssueWrapper } from "./ChildIssueWrapper"

export function ChildIssues({ issues }: { issues: Issue[] }) {
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false)

  return (
    <Stack
      sx={{
        minHeight: "100%",
        alignItems: "center",
      }}
    >
      <ScrollArea
        className="left-panel"
        p="sm"
        sx={{
          minWidth: "260px",
          width: "100%",
          height: "50vh",
        }}
      >
        <Box mr="md">
          <ChildIssueWrapper issues={issues} />
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
    </Stack>
  )
}
