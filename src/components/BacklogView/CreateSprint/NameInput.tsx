import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { SprintCreate } from "types";

export function NameInput({ form }: { form: UseFormReturnType<SprintCreate> }) {
  return (
    <TextInput
      label="Sprint Name"
      placeholder="Enter the name of the new sprint here..."
      required
      {...form.getInputProps("name")}
    />
  );
}
