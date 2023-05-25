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
import { Issue } from "types"
import { useState } from "react"
import { useCanvasStore } from "../../../lib/Store"
import {
  getAssignableUsersByProject,
  getIssueReporter,
} from "../../CreateIssue/queryFunctions"
import { editIssue } from "../helpers/queryFunctions"

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

export function ReporterMenu({ issueKey }: { issueKey: string }) {
  const selectedProject = useCanvasStore((state) => state.selectedProject)
  const queryClient = useQueryClient()
  const [opened, setOpened] = useState(false)
  const { classes } = useStyles({ isOpened: opened })

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
        icon={<Avatar src={user.avatarUrls["24x24"]} size="sm" radius="xl" />}
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
    <Group grow>
      <Text fz="sm" color="dimmed">
        Reporter
      </Text>
      {issueReporter &&
        issueReporter.displayName &&
        issueReporter.avatarUrls && (
          <Menu onOpen={() => setOpened(true)} onClose={() => setOpened(false)}>
            <Menu.Target>
              <UnstyledButton className={classes.control}>
                <Group spacing="xs" position="apart">
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
