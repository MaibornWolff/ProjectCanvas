import { DatePicker } from "@mantine/dates"
import { UseFormReturnType } from "@mantine/form"
import { Issue } from "project-extender"

export function DueDatePicker({
  form,
  issueTypesWithFieldsMap,
}: {
  form: UseFormReturnType<Issue>
  issueTypesWithFieldsMap?: Map<string, string[]>
}) {
  return (
    <DatePicker
      label="Due Date"
      placeholder="Pick due date"
      minDate={form.getInputProps("startDate").value}
      clearable
      disabled={
        issueTypesWithFieldsMap &&
        issueTypesWithFieldsMap.size > 0 &&
        !issueTypesWithFieldsMap
          .get(form.getInputProps("type").value)
          ?.includes("Due date")
      }
      {...form.getInputProps("dueDate")}
      onChange={(value) => {
        form.getInputProps("dueDate").onChange(value)
        if (
          value &&
          form.getInputProps("startDate").value &&
          form.getInputProps("startDate").value > value
        )
          form.setFieldValue("startDate", null as unknown as Date)
      }}
    />
  )
}
