import { Stack } from "@mantine/core";
import { Issue } from "@canvas/types";
import { ChildIssueCard } from "./ChildIssueCard";

export function ChildIssueWrapper({ issues }: { issues: Issue[] }) {
  return (
    <Stack gap="sm">
      {issues.map((issue: Issue, index) => (
        <ChildIssueCard {...issue} key={issue.issueKey} index={index} />
      ))}
    </Stack>
  );
}
