import { Box, Tooltip } from "@mantine/core"
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
  const isDisabled =
    issueTypesWithFieldsMap &&
    issueTypesWithFieldsMap.size > 0 &&
    !issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Start date")

  return (
    <Tooltip
      label="Start Date cannot be picked for this issue type"
      position="top-start"
      events={{
        hover: true && !!isDisabled,
        focus: false && !!isDisabled,
        touch: false && !!isDisabled,
      }}
    >
      <Box>
        <DatePicker
          label="Start Date"
          placeholder="Pick start date"
          withinPortal
          clearable
          disabled={isDisabled}
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
      </Box>
    </Tooltip>
  )
}
