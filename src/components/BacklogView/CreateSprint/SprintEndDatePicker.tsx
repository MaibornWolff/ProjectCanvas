import { DatePickerInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { SprintCreate } from "types";

export function SprintEndDatePicker({
  form,
}: {
  form: UseFormReturnType<SprintCreate>,
}) {
  return (
    <DatePickerInput
      label="End Date"
      placeholder="Pick end date"
      clearable
      {...form.getInputProps("endDate")}
      onChange={(value) => {
        form.getInputProps("endDate").onChange(value);
        if (
          value
          && form.getInputProps("startDate").value
          && form.getInputProps("startDate").value > value
        ) form.setFieldValue("startDate", null as unknown as Date);
      }}
    />
  );
}
