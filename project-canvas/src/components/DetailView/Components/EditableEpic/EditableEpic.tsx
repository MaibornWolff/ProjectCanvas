import { Group, Loader, Select, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Issue } from "types"
import { useState } from "react"
import { editIssue } from "../../helpers/queryFunctions"
import { IssueIcon } from "../../../BacklogView/Issue/IssueIcon"
import { getEpicsByProject } from "./queryFunctions"
import { SelectItem } from "./SelectItem"

export function EditableEpic({
  projectId,
  issueKey,
  epic,
}: {
  projectId: string
  issueKey: string
  epic: string
}) {
  const [showEpicInput, setshowEpicInput] = useState(false)
  const { data: epics } = useQuery({
    queryKey: ["epics", projectId],
    queryFn: () => getEpicsByProject(projectId),
  })
  const [selectedEpic, setselectedEpic] = useState(epic)
  const mutationEpic = useMutation({
    mutationFn: (epicKey: string) =>
      editIssue({ epic: epicKey } as Issue, issueKey),
    onError: () => {
      showNotification({
        message: `An error occured while modifing the Epic 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `Epic for issue ${issueKey} has been modified!`,
        color: "green",
      })
    },
  })

  return (
    <Group>
      <IssueIcon type="Epic" />
      {mutationEpic.isLoading && <Loader size="sm" />}
      {showEpicInput ? (
        <Select
          placeholder=""
          nothingFound="No Options"
          data={
            epics && epics instanceof Array
              ? epics.map((epicItem) => ({
                  value: epicItem.issueKey,
                  label: epicItem.summary,
                }))
              : []
          }
          searchable
          clearable
          itemComponent={SelectItem}
          value={selectedEpic}
          onChange={(value) => {
            setselectedEpic(value!)
            mutationEpic.mutate(value!)
            setshowEpicInput(false)
          }}
          w="300px"
        />
      ) : (
        <Group>
          <Text
            onClick={() => setshowEpicInput(true)}
            sx={{
              ":hover": { textDecoration: "underline", cursor: "pointer" },
            }}
          >
            {selectedEpic || <Text color="dimmed">Add Epic</Text>}
          </Text>
        </Group>
      )}
    </Group>
  )
}
