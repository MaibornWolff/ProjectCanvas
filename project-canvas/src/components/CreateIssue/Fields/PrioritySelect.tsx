import { Box, Select, Tooltip } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { useQuery } from "@tanstack/react-query"
import { Issue } from "types"
import { getPriorities } from "../queryFunctions"
import { SelectItem } from "../SelectItem"

export function PrioritySelect({
  form,
  issueTypesWithFieldsMap,
  isLoading,
}: {
  form: UseFormReturnType<Issue>
  issueTypesWithFieldsMap?: Map<string, string[]>
  isLoading: boolean
}) {
  const { data: priorities } = useQuery({
    queryKey: ["priorities"],
    queryFn: () => getPriorities(),
  })

  const isDisabled =
    issueTypesWithFieldsMap &&
    issueTypesWithFieldsMap.size > 0 &&
    !issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Priority")

  return (
    <Tooltip
      label={
        form.getInputProps("type").value === ""
          ? "Please select an issue type first"
          : "Priority cannot be selected for this issue type"
      }
      position="top-start"
      events={{
        hover: true && !!isDisabled,
        focus: false && !!isDisabled,
        touch: false && !!isDisabled,
      }}
    >
      <Box>
        <Select
          label="Priority"
          placeholder="Choose priority"
          nothingFound="Please select an issue type first"
          itemComponent={SelectItem}
          disabled={isDisabled}
          data={
            !isLoading && priorities && priorities instanceof Array
              ? priorities.map((priority) => ({
                  image: priority.iconUrl,
                  value: priority.id,
                  label: priority.name,
                }))
              : []
          }
          searchable
          withinPortal
          clearable
          {...form.getInputProps("priority.id")}
        />
      </Box>
    </Tooltip>
  )
}
