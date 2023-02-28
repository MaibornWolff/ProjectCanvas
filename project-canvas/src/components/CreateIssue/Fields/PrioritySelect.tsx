import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, Priority } from "project-extender"
import { SelectItem } from "../SelectItem"

export function PrioritySelect({
  form,
  priorities,
  issueTypesWithFieldsMap,
  isLoading,
}: {
  form: UseFormReturnType<Issue>
  priorities?: Priority[]
  issueTypesWithFieldsMap?: Map<string, string[]>
  isLoading: boolean
}) {
  const isDisabled =
    issueTypesWithFieldsMap &&
    issueTypesWithFieldsMap.size > 0 &&
    !issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Priority")

  return (
    <Select
      label="Priority"
      placeholder="Choose priority"
      nothingFound="Select an Issue Type first"
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
      clearable
      {...form.getInputProps("priority.id")}
    />
  )
}
