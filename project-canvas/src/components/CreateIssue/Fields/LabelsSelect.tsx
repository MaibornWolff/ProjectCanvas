import { MultiSelect } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue } from "project-extender"

export function LabelsSelect({
  form,
  labels,
}: {
  form: UseFormReturnType<Issue>
  labels?: string[]
}) {
  return (
    <MultiSelect
      label="Labels"
      placeholder="Choose labels"
      nothingFound="No Options"
      data={labels}
      searchable
      clearable
      {...form.getInputProps("labels")}
    />
  )
}
