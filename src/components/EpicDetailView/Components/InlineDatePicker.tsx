import { UseMutationResult } from "@tanstack/react-query"
import { DatePicker } from "@mantine/dates";
import { DatePickerProps } from "@mantine/dates/lib/components/DatePicker/DatePicker";

export function InlineDatePicker(props: DatePickerProps & {
  date: Date | undefined
  mutation: UseMutationResult<unknown, unknown, Date | null>
}) {
  return (
    <DatePicker
      value={props.date}
      withinPortal
      clearable
      variant="filled"
      onChange={props.mutation.mutate}
      {...props}
    />
  )
}
