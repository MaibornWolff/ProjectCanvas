import { Text, Group } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Issue } from "types";
import { UserSelectMenu } from "../../common/UserSelect/UserSelectMenu";

export function ReporterMenu({ issueKey }: { issueKey: string }) {
  const queryClient = useQueryClient();

  const { data: issueReporter } = useQuery({
    queryKey: ["issueReporter", issueKey],
    queryFn: () => window.provider.getIssueReporter(issueKey),
    enabled: !!issueKey,
  });

  const mutation = useMutation({
    mutationFn: (issue: Issue) => window.provider.editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: "The issue couldn't be modified! 😢",
        color: "red",
      });
    },
    onSuccess: () => {
      showNotification({
        message: `The reporter for issue ${issueKey} has been modified!`,
        color: "green",
      });
      queryClient.invalidateQueries({ queryKey: ["issueReporter"] });
    },
  });

  return (
    <Group grow>
      <Text fz="sm" c="dimmed">
        Reporter
      </Text>
      {issueReporter
        && issueReporter.displayName
        && issueReporter.avatarUrls && (
          <UserSelectMenu
            value={issueReporter}
            onChange={(selectedUser) => mutation.mutate({ reporter: selectedUser } as Issue)}
          />
      )}
    </Group>
  );
}
