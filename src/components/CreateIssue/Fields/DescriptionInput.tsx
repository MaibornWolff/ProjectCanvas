import { Textarea } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue } from "types"

export function DiscriptionInput({ form }: { form: UseFormReturnType<Issue> }) {
  return (
    <Textarea
      label="Description"
      placeholder="Enter the issue description here..."
      autosize
      minRows={6}
      {...form.getInputProps("description")}
    />
  )
}
