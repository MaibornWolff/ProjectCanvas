import { DatePickerInput } from "@mantine/dates"
import { UseFormReturnType } from "@mantine/form"
import { SprintCreate } from "types"

export function SprintStartDatePicker({
  form,
}: {
  form: UseFormReturnType<SprintCreate>
}) {
  return (
    <DatePickerInput
      label="Start Date"
      placeholder="Pick start date"
      clearable
      {...form.getInputProps("startDate")}
      onChange={(value) => {
        form.getInputProps("startDate").onChange(value)
        if (
          value &&
          form.getInputProps("endDate").value &&
          form.getInputProps("endDate").value < value
        )
          form.setFieldValue("endDate", null as unknown as Date)
      }}
    />
  )
}
