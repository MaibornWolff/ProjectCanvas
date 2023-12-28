import { Select, Tooltip, Box } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { useQuery } from "@tanstack/react-query"
import { Issue, IssueType } from "types"
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
    <Tooltip
      label={
        form.getInputProps("type").value === ""
          ? "Please select an issue type first"
          : "Sprint cannot be selected for this issue type"
      }
      position="top-start"
      events={{
        hover: isDisabled ?? false,
        focus: false,
        touch: false,
      }}
    >
      <Box>
        <Select
          label="Sprint"
          placeholder="Choose sprint"
          nothingFoundMessage="Please select an issue type first"
          disabled={isDisabled}
          data={
            !isLoading && sprints
              ? sprints.map((sprint) => ({
                  value: sprint.id.toString(),
                  label: sprint.name,
                }))
              : []
          }
          searchable
          clearable
          {...form.getInputProps("sprint.id")}
        />
      </Box>
    </Tooltip>
  )
}
