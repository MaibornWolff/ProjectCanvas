import { Box, Button, Divider, ScrollArea, Stack } from "@mantine/core";
import { useState } from "react";
import { Issue } from "../../../../types";
import { CreateIssueModal } from "../../CreateIssue/CreateIssueModal";
import { useColorScheme } from "../../../common/color-scheme";
import { ChildIssueCard } from "./ChildIssueCard";

export function ChildIssues({ issues }: { issues: Issue[] }) {
  const colorScheme = useColorScheme();
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false);

  return (
    <Stack style={{ minHeight: "100%", alignItems: "center" }}>
      <ScrollArea
        p="sm"
        style={{
          minWidth: "260px",
          width: "100%",
          height: "50vh",
        }}
      >
        <Box mr="md">
          <Stack gap="sm">
            {issues.map((issue: Issue, index) => (
              <ChildIssueCard {...issue} key={issue.issueKey} index={index} />
            ))}
          </Stack>
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
            style={(theme) => ({
              justifyContent: "left",
              ":hover": {
                background:
                  colorScheme === "dark"
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
          onCancel={() => setCreateIssueModalOpened(false)}
          onCreate={() => setCreateIssueModalOpened(false)}
        />
      </ScrollArea>
      <Divider mr="xs" size="xl" style={{ cursor: "col-resize" }} />
    </Stack>
  );
}
