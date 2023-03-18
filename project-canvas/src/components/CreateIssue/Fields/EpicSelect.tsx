import { Select, Tooltip, Box } from "@mantine/core"
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

  const isDisabled =
    issueTypesWithFieldsMap &&
    issueTypesWithFieldsMap.size > 0 &&
    (!issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Sprint") ||
      form.getInputProps("type").value ===
        issueTypes?.find((issueType) => issueType.name === "Epic")?.id)

  return (
    <Tooltip
      label="Epic cannot be selected for this issue type"
      position="top-start"
      events={{
        hover: true && !!isDisabled,
        focus: false && !!isDisabled,
        touch: false && !!isDisabled,
      }}
    >
      <Box>
        <Select
          label="Epic"
          placeholder="Choose epic"
          nothingFound={
            epics && epics.length > 0
              ? "Please select an issue type first"
              : "No epics found"
          }
          disabled={isDisabled}
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
          withinPortal
          {...form.getInputProps("epic")}
        />
      </Box>
    </Tooltip>
  )
}
