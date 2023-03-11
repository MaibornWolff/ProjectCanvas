import { DatePicker } from "@mantine/dates"
import { UseFormReturnType } from "@mantine/form"
import { Issue } from "project-extender"

export function StartDatePicker({
  form,
  issueTypesWithFieldsMap,
}: {
  form: UseFormReturnType<Issue>
  issueTypesWithFieldsMap?: Map<string, string[]>
}) {
  return (
    <DatePicker
      label="Start Date"
      placeholder="Pick start date"
      clearable
      disabled={
        issueTypesWithFieldsMap &&
        issueTypesWithFieldsMap.size > 0 &&
        !issueTypesWithFieldsMap
          .get(form.getInputProps("type").value)
          ?.includes("Start date")
      }
      {...form.getInputProps("startDate")}
      onChange={(value) => {
        form.getInputProps("startDate").onChange(value)
        if (
          value &&
          form.getInputProps("dueDate").value &&
          form.getInputProps("dueDate").value < value
        )
          form.setFieldValue("dueDate", null as unknown as Date)
      }}
    />
  )
}
