import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { useQuery } from "@tanstack/react-query"
import { Issue, IssueType } from "project-extender"
import { getBoardIds, getSprints } from "../queryFunctions"

export function SprintSelect({
  form,
  issueTypes,
  issueTypesWithFieldsMap,
  enabled,
  isLoading,
}: {
  form: UseFormReturnType<Issue>
  issueTypes?: IssueType[]
  issueTypesWithFieldsMap?: Map<string, string[]>
  enabled: boolean
  isLoading: boolean
}) {
  const { data: boardIds } = useQuery({
    queryKey: ["boards", form.getInputProps("projectId").value],
    queryFn: () => getBoardIds(form.getInputProps("projectId").value!),
    enabled: enabled && !!form.getInputProps("projectId").value,
  })
  const { data: sprints } = useQuery({
    queryKey: ["sprints"],
    // TODO: fetch when boards are fetched (iterate over all boards) or select a specific one
    queryFn: () => getSprints(boardIds![0]),
    enabled: enabled && !!boardIds && !!boardIds[0],
  })

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
