import {
  Text,
  Group,
  Menu,
  Avatar,
  UnstyledButton,
  ScrollArea,
} from "@mantine/core"
import { IconChevronDown } from "@tabler/icons"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { User } from "../../../../types"
import { useCanvasStore } from "../../../lib/Store"
import { getAssignableUsersByProject } from "../../../common/query-functions";

import classes from './UserSelectMenu.module.css'

export function UserSelectMenu({
  value,
  onChange,
  placeholder = ""
}: {
  value: User | undefined,
  onChange: (user: User) => void,
  placeholder?: string
}) {
  const selectedProject = useCanvasStore((state) => state.selectedProject)
  const [opened, setOpened] = useState(false)

  const { data: assignableUsers } = useQuery({
    queryKey: ["assignableUsers", selectedProject?.key],
    queryFn: () => getAssignableUsersByProject(selectedProject?.key!),
    enabled: !!selectedProject && !!selectedProject.key,
  })

  const displayedUsers = assignableUsers ? (
    assignableUsers.map((assignableUser) => (
      <Menu.Item
        leftSection={<Avatar src={assignableUser.avatarUrls["24x24"]} size="sm" radius="xl" />}
        onClick={() => onChange(assignableUser)}
        key={assignableUser.id}
      >
        {assignableUser.displayName}
      </Menu.Item>
    ))
  ) : (
    <Menu.Item>
      <Text c="dimmed">None</Text>
    </Menu.Item>
  )

  return (
    <Menu onOpen={() => setOpened(true)} onClose={() => setOpened(false)}>
      <Menu.Target>
        <UnstyledButton className={classes.control} mod={{ opened }}>
          {value ? (
            <Group gap="xs" justify="apart">
              <Avatar src={value.avatarUrls["24x24"]} size="sm" radius="xl" />
              <Text size="sm">{value.displayName}</Text>
              <IconChevronDown size={18} stroke={1.5} className={classes.icon}/>
            </Group>
          ) : (
            <Group gap="xs" justify="apart">
              <Avatar size="sm" variant="outline" radius="xl" />
              <Text size="sm" c="dimmed">{placeholder}</Text>
              <IconChevronDown size={18} stroke={1.5} className={classes.icon} />
            </Group>
          )}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <ScrollArea style={{ height: 200 }} type="auto">
          {displayedUsers}
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  )
}
