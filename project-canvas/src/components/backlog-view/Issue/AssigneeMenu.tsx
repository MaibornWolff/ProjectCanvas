import { Text, Group, Menu, Image, UnstyledButton } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconChevronDown } from "@tabler/icons"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { useCanvasStore } from "../../../lib/Store"
import {
  editIssue,
  getAssignableUsersByProject,
} from "../../CreateIssue/queryFunctions"

export function AssigneeMenu({
  assignee,
  issueKey,
}: {
  assignee: Issue["assignee"]
  issueKey: string
}) {
  const selectedProject = useCanvasStore((state) => state.selectedProject)

  const { data: assignableUsers } = useQuery({
    queryKey: ["assignableUsers", selectedProject?.key],
    queryFn: () => getAssignableUsersByProject(selectedProject?.key!),
    enabled: !!assignee && !!selectedProject && !!selectedProject.key,
  })

  const mutation = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: `The issue couldn't be modified! 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `The assignee for issue ${issueKey} has been modified!`,
        color: "green",
      })
    },
  })

  const displayedAssignees = assignableUsers ? (
    assignableUsers.map((user) => (
      <Menu.Item
        icon={<Image src={user.avatarUrls["24x24"]} width={18} height={18} />}
        onClick={() => mutation.mutate({ reporter: user.accountId } as Issue)}
        key={user.accountId}
      >
        {user.displayName}
      </Menu.Item>
    ))
  ) : (
    <Menu.Item>
      <Text color="dimmed">None</Text>
    </Menu.Item>
  )
  return (
    <Group position="apart">
      <Text color="dimmed">Assignee</Text>
      {assignee &&
      assignee.displayName &&
      assignee.avatarUrls &&
      displayedAssignees &&
      assignableUsers ? (
        <Menu>
          <Menu.Target>
            <UnstyledButton>
              <Group spacing="xs" position="apart">
                <Image
                  src={assignee.avatarUrls["24x24"]}
                  width={22}
                  height={22}
                />
                <Text size="sm">{assignee.displayName}</Text>
                <IconChevronDown size={18} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>{displayedAssignees}</Menu.Dropdown>
        </Menu>
      ) : (
        <Text color="dimmed">None</Text>
      )}
    </Group>
  )
}
