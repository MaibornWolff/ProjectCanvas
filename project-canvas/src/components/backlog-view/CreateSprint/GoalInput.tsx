import { TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { SprintCreate } from "project-extender"

export function GoalInput({ form }: { form: UseFormReturnType<SprintCreate> }) {
  return (
    <TextInput
      label="Sprint Goal"
      placeholder="Enter the goal of the new sprint here..."
      {...form.getInputProps("goal")}
    />
  )
}
