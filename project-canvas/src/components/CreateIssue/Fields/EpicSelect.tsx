import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { useQuery } from "@tanstack/react-query"
import { Issue, IssueType } from "project-extender"
import { getEpicsByProject } from "../queryFunctions"

export function EpicSelect({
  form,
  enabled,
  issueTypes,
  issueTypesWithFieldsMap,
  isLoading,
}: {
  form: UseFormReturnType<Issue>
  enabled: boolean
  issueTypes?: IssueType[]
  issueTypesWithFieldsMap?: Map<string, string[]>

  isLoading: boolean
}) {
  const { data: epics } = useQuery({
    queryKey: ["epics", form.getInputProps("projectId").value],
    queryFn: () => getEpicsByProject(form.getInputProps("projectId").value!),
    enabled: enabled && !!form.getInputProps("projectId").value,
  })

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
