import { Box, Tooltip } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { Issue } from "types";

export function StartDatePicker({
  form,
  issueTypesWithFieldsMap,
}: {
  form: UseFormReturnType<Issue>,
  issueTypesWithFieldsMap?: Map<string, string[]>,
}) {
  const isDisabled = issueTypesWithFieldsMap
    && issueTypesWithFieldsMap.size > 0
    && !issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Start date");

  return (
    <Tooltip
      label={
        form.getInputProps("type").value === ""
          ? "Please select an issue type first"
          : "Start Date cannot be picked for this issue type"
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
          label="Start Date"
          placeholder="Pick start date"
          clearable
          disabled={isDisabled}
          {...form.getInputProps("startDate")}
          onChange={(value) => {
            form.getInputProps("startDate").onChange(value);
            if (
              value
              && form.getInputProps("dueDate").value
              && form.getInputProps("dueDate").value < value
            ) form.setFieldValue("dueDate", null as unknown as Date);
          }}
        />
      </Box>
    </Tooltip>
  );
}
