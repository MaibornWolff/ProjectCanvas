import { TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue } from "project-extender"

export function SummaryInput({ form }: { form: UseFormReturnType<Issue> }) {
  return (
    <TextInput
      label="Summary"
      placeholder="Enter the issue summary here..."
      required
      {...form.getInputProps("summary")}
    />
  )
}
