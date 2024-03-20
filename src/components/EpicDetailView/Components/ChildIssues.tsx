import { Box, Button, Group, Stack } from "@mantine/core";
import { useState } from "react";
import { Issue } from "@canvas/types";
import { useColorScheme } from "@canvas/common/color-scheme";
import { CreateIssueModal } from "../../CreateIssue/CreateIssueModal";
import { ChildIssueCard } from "./ChildIssueCard";

export function ChildIssues({ issues }: { issues: Issue[] }) {
  const colorScheme = useColorScheme();
  const [createIssueModalOpened, setCreateIssueModalOpened] = useState(false);

  return (
    <Stack style={{ minHeight: "100%", alignItems: "center" }}>
      {issues.length > 0 && (
        <Box p="sm" w="100%">
          <Stack gap="sm">
            {issues.map((issue: Issue) => (<ChildIssueCard {...issue} key={issue.issueKey} />))}
          </Stack>
        </Box>
      )}
      <Group w="100%" p="sm">
        <Button
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
      </Group>
      <CreateIssueModal
        opened={createIssueModalOpened}
        onCancel={() => setCreateIssueModalOpened(false)}
        onCreate={() => setCreateIssueModalOpened(false)}
      />
    </Stack>
  );
}
