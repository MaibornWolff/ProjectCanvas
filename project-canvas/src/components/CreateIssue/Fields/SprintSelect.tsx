import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, IssueType, Sprint } from "project-extender"

export function SprintSelect({
  form,
  sprints,
  issueTypes,
  issueTypesWithFieldsMap,
  isLoading,
}: {
  form: UseFormReturnType<Issue>
  sprints?: Sprint[]
  issueTypes?: IssueType[]
  issueTypesWithFieldsMap?: Map<string, string[]>
  isLoading: boolean
}) {
  const isDisabled =
    issueTypesWithFieldsMap &&
    issueTypesWithFieldsMap.size > 0 &&
    (!issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Sprint") ||
      form.getInputProps("type").value ===
        issueTypes?.find((issueType) => issueType.name === "Epic")?.id)

  return (
    <Select
      label="Sprint"
      placeholder="Backlog"
      nothingFound="No Options"
      disabled={isDisabled}
      data={
        !isLoading && sprints && sprints instanceof Array
          ? sprints.map((sprint) => ({
              value: sprint.id,
              label: sprint.name,
            }))
          : []
      }
      searchable
      clearable
      {...form.getInputProps("sprintId")}
    />
  )
}
