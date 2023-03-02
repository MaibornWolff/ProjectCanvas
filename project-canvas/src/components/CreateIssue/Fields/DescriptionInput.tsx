import { Textarea } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue } from "project-extender"

export function DiscriptionInput({ form }: { form: UseFormReturnType<Issue> }) {
  return (
    <Textarea
      label="Description"
      autosize
      minRows={6}
      {...form.getInputProps("description")}
    />
  )
}
