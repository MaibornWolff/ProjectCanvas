import { Box, Button, Menu } from "@mantine/core"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconCaretDown } from "@tabler/icons-react"
import { getIssueTypes, setStatus } from "../../CreateIssue/queryFunctions"
import classes from "./IssueStatusMenu.module.css"

export function IssueStatusMenu({
  projectId,
  type,
  status,
  issueKey,
}: {
  projectId: string
  type: string
  status: string
  issueKey: string
}) {
  const [opened, setOpened] = useState(false)

  const { data: issueTypes } = useQuery({
    queryKey: ["issueTypes", projectId],
    queryFn: () => getIssueTypes(projectId),
    enabled: !!projectId,
  })

  const queryClient = useQueryClient()
  const [defaultStatus, setDefaultStatus] = useState(status)
  const statusMutation = useMutation({
    mutationFn: (targetStatus: string) => setStatus(issueKey, targetStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  return (
    <Box className={classes.root} mod={{ opened }}>
      <Menu
        shadow="md"
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
      >
        <Menu.Target>
          <Button rightSection={<IconCaretDown className={classes.icon} />}>
            {defaultStatus}
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {issueTypes &&
            issueTypes
              .find((issueType) => issueType.name === type)
              ?.statuses?.map((issueStatus) => (
                <Menu.Item
                  key={issueStatus.id}
                  onClick={() => {
                    statusMutation.mutate(issueStatus.name)
                    setDefaultStatus(issueStatus.name)
                  }}
                >
                  {issueStatus.name}
                </Menu.Item>
              ))}
        </Menu.Dropdown>
      </Menu>
    </Box>
  )
}
