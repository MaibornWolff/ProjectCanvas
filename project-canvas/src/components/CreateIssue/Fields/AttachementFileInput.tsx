import { FileInput, Text } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { IconFileUpload } from "@tabler/icons"
import { Issue } from "types"

export function AttachementFileInput({
  form,
}: {
  form: UseFormReturnType<Issue>
}) {
  const numbFiles: number = form.getInputProps("attachment").value
    ? (form.getInputProps("attachment").value as []).length
    : 0
  const label: string =
    numbFiles === 0 ? "Attachments" : `Attachments (${numbFiles})`
  return (
    <FileInput
      label={<Text>{label}</Text>}
      placeholder="Upload Files"
      icon={<IconFileUpload />}
      multiple
      clearable
      {...form.getInputProps("attachment")}
    />
  )
}
