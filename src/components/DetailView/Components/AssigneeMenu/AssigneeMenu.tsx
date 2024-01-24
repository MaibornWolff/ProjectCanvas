import { Group, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { Issue } from "types";
import { editIssueMutation } from "./queries";
import { UserSelectMenu } from "../../../common/UserSelect/UserSelectMenu";

export function AssigneeMenu({
  assignee,
  issueKey,
}: {
  assignee: Issue["assignee"];
  issueKey: string;
}) {
  const queryClient = useQueryClient();
  const editIssue = editIssueMutation(queryClient, issueKey);

  return (
    <Group grow>
      <Text fz="sm" c="dimmed">
        Assignee
      </Text>
      <UserSelectMenu
        value={assignee}
        onChange={(selectedUser) =>
          editIssue.mutate({ assignee: selectedUser } as Issue)
        }
        placeholder="Unassigned"
      />
    </Group>
  );
}
