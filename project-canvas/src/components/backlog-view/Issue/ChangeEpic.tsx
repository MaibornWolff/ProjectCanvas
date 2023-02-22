import { Text, Group, Select, Loader } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { forwardRef, useState } from "react"
import { editIssue, getEpicsByProject } from "../../CreateIssue/queryFunctions"
import { IssueIcon } from "./IssueIcon"

export function ChangeEpic({
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
        message: `error occured while modifing the Epic 😢`,
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

  interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
    image: string
    label: string
    description: string
  }
  // eslint-disable-next-line react/no-unstable-nested-components
  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ label, description, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <IssueIcon type="Epic" />

          <div>
            <Text size="sm" lineClamp={1}>
              {label}
            </Text>
            <Text size="xs" opacity={0.65} lineClamp={1}>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  )

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
          color="purple"
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
            {selectedEpic || "Add Epic"}
          </Text>
        </Group>
      )}
    </Group>
  )
}
