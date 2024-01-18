import { Box, Group, Loader, Text } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Issue } from "types"
import { useState } from "react"
import { editIssue } from "../../helpers/queryFunctions"
import { IssueIcon } from "../../../BacklogView/Issue/IssueIcon"
import { getEpicsByProject } from "./queryFunctions"
import { SelectItem } from "./SelectItem"
import { CustomItemSelect } from "../../../common/CustomItemSelect";

export function EditableEpic({
  projectId,
  issueKey,
  epic,
}: {
  projectId: string
  issueKey: string
  epic: {
    issueKey?: string,
    summary?: string,
  }
}) {
  const [showEpicInput, setShowEpicInput] = useState(false)
  const { data: epics } = useQuery({
    queryKey: ["epics", projectId],
    queryFn: () => getEpicsByProject(projectId),
  })
  const [selectedEpic, setSelectedEpic] = useState(epic.issueKey)
  const mutationEpic = useMutation({
    mutationFn: (epicKey: string | null) => editIssue({ epic: { issueKey: epicKey } } as Issue, issueKey),
    onError: () => {
      showNotification({
        message: `An error occurred while modifing the Epic 😢`,
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
      {mutationEpic.isPending && <Loader size="sm" />}
      {showEpicInput ? (
        <Box w="300px">
          <CustomItemSelect
            nothingFoundMessage="No Options"
            options={
              epics
                ? epics.map((epicItem) => ({
                  value: epicItem.issueKey,
                  label: epicItem.summary,
                }))
                : []
            }
            searchable
            clearable
            ItemComponent={SelectItem}
            value={selectedEpic}
            onChange={(value) => {
              setSelectedEpic(value)
              mutationEpic.mutate(value ?? null)
              setShowEpicInput(false)
            }}
          />
        </Box>
      ) : (
        <Group>
          <Text
            onClick={() => setShowEpicInput(true)}
            style={{
              ":hover": { textDecoration: "underline", cursor: "pointer" },
            }}
            {...(!selectedEpic && { c: "dimmed" })}
          >
            {selectedEpic || "Add Epic"}
          </Text>
        </Group>
      )}
    </Group>
  )
}
