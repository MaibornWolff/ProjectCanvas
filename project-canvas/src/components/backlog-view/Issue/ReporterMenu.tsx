import { Text, Group, Menu, Image, UnstyledButton } from "@mantine/core"
import { IconChevronDown } from "@tabler/icons"
import { useQuery } from "@tanstack/react-query"
import { useCanvasStore } from "../../../lib/Store"
import {
  getAssignableUsersByProject,
  getIssueReporter,
} from "../../CreateIssue/queryFunctions"

export function ReporterMenu({ issueKey }: { issueKey: string }) {
  const selectedProject = useCanvasStore((state) => state.selectedProject)

  const { data: reporter } = useQuery({
    queryKey: ["reporter", issueKey],
    queryFn: () => getIssueReporter(issueKey),
    enabled: !!issueKey,
  })
  const { data: assignableUsers } = useQuery({
    queryKey: ["assignableUsers", selectedProject?.key],
    queryFn: () => getAssignableUsersByProject(selectedProject?.key!),
    enabled: !!reporter && !!selectedProject && !!selectedProject.key,
  })

  const displayedReporters = assignableUsers ? (
    assignableUsers.map((user) => (
      <Menu.Item
        icon={<Image src={user.avatarUrls["24x24"]} width={18} height={18} />}
        onClick={() => {}}
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
      {reporter &&
      reporter.displayName &&
      reporter.avatarUrls &&
      displayedReporters &&
      assignableUsers ? (
        <Menu>
          <Menu.Target>
            <UnstyledButton>
              <Group spacing="xs" position="apart">
                <Image
                  src={reporter.avatarUrls["24x24"]}
                  width={22}
                  height={22}
                />
                <Text size="sm">{reporter.displayName}</Text>
                <IconChevronDown size={18} stroke={1.5} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>{displayedReporters}</Menu.Dropdown>
        </Menu>
      ) : (
        <Text color="dimmed">None</Text>
      )}
    </Group>
  )
}
