import { Tooltip, Box } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import { UseFormReturnType } from "@mantine/form"
import { Issue } from "types"

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
      label={
        form.getInputProps("type").value === ""
          ? "Please select an issue type first"
          : "Due Date cannot be picked for this issue type"
      }
      position="top-start"
      events={{
        hover: isDisabled ?? false,
        focus: false,
        touch: false,
      }}
    >
      <Box>
        <DatePickerInput
          label="Due Date"
          placeholder="Pick due date"
          minDate={form.getInputProps("startDate").value}
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
