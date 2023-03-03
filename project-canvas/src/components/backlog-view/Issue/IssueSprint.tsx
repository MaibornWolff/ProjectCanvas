import { Text, Box, Select } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Issue, Sprint } from "project-extender"
import { useState } from "react"
import { useCanvasStore } from "../../../lib/Store"
import {
  editIssue,
  getSprints,
  moveIssueToBacklog,
} from "../../CreateIssue/queryFunctions"

export function IssueSprint(props: {
  sprint: Sprint | undefined
  issueKey: string
}) {
  const [defaultsprint, setdefaultsprint] = useState(props.sprint || undefined)
  const [showSprintInput, setshowSprintInput] = useState(false)

  const boardIds = useCanvasStore((state) => state.selectedProjectBoardIds)
  const currentBoardId = boardIds[0]
  const { data: sprints } = useQuery({
    queryKey: ["sprints"],
    queryFn: () => getSprints(currentBoardId),
    enabled: !!currentBoardId,
  })

  const mutationSprint = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, props.issueKey),
    onError: () => {
      showNotification({
        message: `error occured while modifing the sprint 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `sprint for issue ${props.issueKey} has been modified!`,
        color: "green",
      })
    },
  })
  const mutationBacklog = useMutation({
    mutationFn: () => moveIssueToBacklog(props.issueKey),
    onError: () => {
      showNotification({
        message: `error occured while modifing the sprint 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `sprint for issue ${props.issueKey} has been modified!`,
        color: "green",
      })
    },
  })
  const sprintNames = sprints ? sprints?.map((sprint) => sprint.name) : []
  return (
    <span>
      {showSprintInput ? (
        <Select
          nothingFound="No Options"
          searchable
          clearable
          defaultValue={props.sprint ? props.sprint.name : ""}
          data={sprintNames}
          onBlur={() => {
            setshowSprintInput(false)
            if (defaultsprint)
              mutationSprint.mutate({
                sprint: defaultsprint,
              } as Issue)
            else mutationBacklog.mutate()
          }}
          onChange={(value) => {
            if (value === "") setdefaultsprint(undefined)
            else
              setdefaultsprint(
                sprints?.find((sprint) => sprint.name === value)!
              )
          }}
        />
      ) : (
        <Box onClick={() => setshowSprintInput(true)}>
          {defaultsprint ? (
            <Text>{defaultsprint.name}</Text>
          ) : (
            <Text color="dimmed">None</Text>
          )}
        </Box>
      )}
    </span>
  )
}
