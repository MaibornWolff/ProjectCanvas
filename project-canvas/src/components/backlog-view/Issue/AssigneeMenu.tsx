import {
  Text,
  Group,
  Menu,
  Avatar,
  UnstyledButton,
  ScrollArea,
  createStyles,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconChevronDown } from "@tabler/icons"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { useState } from "react"
import { useCanvasStore } from "../../../lib/Store"
import {
  editIssue,
  getAssignableUsersByProject,
} from "../../CreateIssue/queryFunctions"

const useStyles = createStyles(
  (theme, { isOpened }: { isOpened: boolean }) => ({
    control: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: theme.radius.md,
      padding: "3px",
      border: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[2]
      }`,
      transition: "background-color 150ms ease",
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[isOpened ? 5 : 6]
          : theme.white[isOpened ? 5 : 6],

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
      },
    },

    icon: {
      transition: "transform 150ms ease",
      transform: isOpened ? "rotate(180deg)" : "rotate(0deg)",
    },
  })
)

export function AssigneeMenu({
  assignee,
  issueKey,
}: {
  assignee: Issue["assignee"]
  issueKey: string
}) {
  const selectedProject = useCanvasStore((state) => state.selectedProject)
  const queryClient = useQueryClient()
  const [opened, setOpened] = useState(false)
  const { classes } = useStyles({ isOpened: opened })

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
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  const displayedAssignees = assignableUsers ? (
    assignableUsers.map((user) => (
      <Menu.Item
        icon={<Avatar src={user.avatarUrls["24x24"]} size="sm" radius="xl" />}
        onClick={() =>
          mutation.mutate({ assignee: { id: user.accountId } } as Issue)
        }
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
      <Text fz="sm" color="dimmed">
        Assignee
      </Text>
      {displayedAssignees && assignableUsers ? (
        <Menu onOpen={() => setOpened(true)} onClose={() => setOpened(false)}>
          <Menu.Target>
            <UnstyledButton className={classes.control}>
              {assignee && assignee.displayName && assignee.avatarUrls ? (
                <Group spacing="xs" position="apart">
                  <Avatar
                    src={assignee.avatarUrls["24x24"]}
                    size="sm"
                    radius="xl"
                  />
                  <Text size="sm">{assignee.displayName}</Text>
                  <IconChevronDown
                    size={18}
                    stroke={1.5}
                    className={classes.icon}
                  />
                </Group>
              ) : (
                <Group spacing="xs" position="apart">
                  <Avatar radius="xl" />
                  <Text size="sm" color="dimmed">
                    Unassigned
                  </Text>
                  <IconChevronDown
                    size={18}
                    stroke={1.5}
                    className={classes.icon}
                  />
                </Group>
              )}
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <ScrollArea style={{ height: 200 }} type="auto">
              {displayedAssignees}
            </ScrollArea>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Text color="dimmed">None</Text>
      )}
    </Group>
  )
}
