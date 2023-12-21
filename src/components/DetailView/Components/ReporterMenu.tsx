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
import { Issue } from "types"
import { useState } from "react"
import { useCanvasStore } from "../../../lib/Store"
import {
  getAssignableUsersByProject,
  getIssueReporter,
} from "../../CreateIssue/queryFunctions"
import { editIssue } from "../helpers/queryFunctions"

import classes from './ReporterMenu.module.css'

export function ReporterMenu({ issueKey }: { issueKey: string }) {
  const selectedProject = useCanvasStore((state) => state.selectedProject)
  const queryClient = useQueryClient()
  const [opened, setOpened] = useState(false)

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
        leftSection={<Avatar src={user.avatarUrls["24x24"]} size="sm" radius="xl" />}
        onClick={() => mutation.mutate({ reporter: user } as Issue)}
        key={user.id}
      >
        {user.displayName}
      </Menu.Item>
    ))
  ) : (
    <Menu.Item>
      <Text c="dimmed">None</Text>
    </Menu.Item>
  )
  return (
    <Group grow>
      <Text fz="sm" c="dimmed">
        Reporter
      </Text>
      {issueReporter && issueReporter.displayName && issueReporter.avatarUrls && (
        <Menu onOpen={() => setOpened(true)} onClose={() => setOpened(false)}>
          <Menu.Target>
            <UnstyledButton className={classes.control}>
              <Group gap="xs" justify="apart">
                <Avatar
                  src={issueReporter.avatarUrls["24x24"]}
                  size="sm"
                  radius="xl"
                />
                <Text size="sm">{issueReporter.displayName}</Text>
                <IconChevronDown
                  size={18}
                  stroke={1.5}
                  className={classes.icon}
                />
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
