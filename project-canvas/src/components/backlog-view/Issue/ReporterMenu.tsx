import {
  Text,
  Group,
  Menu,
  Avatar,
  UnstyledButton,
  ScrollArea,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconChevronDown } from "@tabler/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { useCanvasStore } from "../../../lib/Store"
import {
  editIssue,
  getAssignableUsersByProject,
  getIssueReporter,
} from "../../CreateIssue/queryFunctions"

export function ReporterMenu({ issueKey }: { issueKey: string }) {
  const selectedProject = useCanvasStore((state) => state.selectedProject)
  const queryClient = useQueryClient()

  const { data: issueReporter } = useQuery({
    queryKey: ["issueReporter", issueKey],
    queryFn: () => getIssueReporter(issueKey),
    enabled: !!issueKey,
  })
  const { data: assignableUsers } = useQuery({
    queryKey: ["assignableUsers", selectedProject?.key],
    queryFn: () => getAssignableUsersByProject(selectedProject?.key!),
    enabled: !!issueReporter && !!selectedProject && !!selectedProject.key,
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
        message: `The reporter for issue ${issueKey} has been modified!`,
        color: "green",
      })
      queryClient.invalidateQueries({ queryKey: ["issueReporter"] })
    },
  })

  const displayedReporters = assignableUsers ? (
    assignableUsers.map((user) => (
      <Menu.Item
        icon={
          <Avatar
            src={user.avatarUrls["24x24"]}
            size="sm"
            radius="xl"
            ml={4}
            mr={4}
          />
        }
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
      <Text color="dimmed">Reporter</Text>
      {issueReporter &&
        issueReporter.displayName &&
        issueReporter.avatarUrls && (
          <Menu>
            <Menu.Target>
              <UnstyledButton>
                <Group spacing="xs" position="apart">
                  <Avatar
                    src={issueReporter.avatarUrls["24x24"]}
                    size="sm"
                    radius="xl"
                    ml={4}
                    mr={4}
                  />
                  <Text size="sm">{issueReporter.displayName}</Text>
                  <IconChevronDown size={18} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <ScrollArea style={{ height: 200 }} type="auto">
                {displayedReporters}
              </ScrollArea>
            </Menu.Dropdown>
          </Menu>
        )}
    </Group>
  )
}
