import { TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { SprintCreate } from "project-extender"

export function NameInput({ form }: { form: UseFormReturnType<SprintCreate> }) {
  return (
    <TextInput
      label="Sprint Name"
      placeholder="Enter the name of the new sprint here..."
      required
      {...form.getInputProps("name")}
    />
  )
}
