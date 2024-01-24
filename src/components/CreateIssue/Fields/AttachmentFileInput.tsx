import { FileInput, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconFileUpload } from "@tabler/icons-react";
import { Issue } from "types";

export function AttachmentFileInput({
  form,
}: {
  form: UseFormReturnType<Issue>;
}) {
  const numbFiles: number = form.getInputProps("attachment").value
    ? (form.getInputProps("attachment").value as []).length
    : 0;
  const label: string = numbFiles === 0 ? "Attachments" : `Attachments (${numbFiles})`;
  return (
    <FileInput
      label={<Text>{label}</Text>}
      placeholder="Upload Files"
      leftSection={<IconFileUpload />}
      multiple
      clearable
      {...form.getInputProps("attachment")}
    />
  );
}
