import { Tooltip, Box } from "@mantine/core"
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
  const isDisabled =
    issueTypesWithFieldsMap &&
    issueTypesWithFieldsMap.size > 0 &&
    !issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Due date")
  return (
    <Tooltip
      label="Due Date cannot be picked for this issue type"
      position="top-start"
      events={{
        hover: true && !!isDisabled,
        focus: false && !!isDisabled,
        touch: false && !!isDisabled,
      }}
    >
      <Box>
        <DatePicker
          label="Due Date"
          placeholder="Pick due date"
          minDate={form.getInputProps("startDate").value}
          withinPortal
          clearable
          disabled={isDisabled}
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
      </Box>
    </Tooltip>
  )
}
