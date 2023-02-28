import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, IssueType } from "project-extender"

export function EpicSelect({
  form,
  epics,
  issueTypes,
  issueTypesWithFieldsMap,
  isLoading,
}: {
  form: UseFormReturnType<Issue>
  epics?: Issue[]
  issueTypes?: IssueType[]
  issueTypesWithFieldsMap?: Map<string, string[]>

  isLoading: boolean
}) {
  return (
    <Select
      label="Epic"
      placeholder=""
      nothingFound="No Options"
      disabled={
        issueTypesWithFieldsMap &&
        issueTypesWithFieldsMap.size > 0 &&
        (!issueTypesWithFieldsMap
          .get(form.getInputProps("type").value)
          ?.includes("Sprint") ||
          form.getInputProps("type").value ===
            issueTypes?.find((issueType) => issueType.name === "Epic")?.id)
      }
      data={
        !isLoading && epics && epics instanceof Array
          ? epics.map((epic) => ({
              value: epic.issueKey,
              label: epic.summary,
            }))
          : []
      }
      searchable
      clearable
      {...form.getInputProps("epic")}
    />
  )
}
