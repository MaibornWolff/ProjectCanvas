import { FileInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { IconFileUpload } from "@tabler/icons"
import { Issue } from "project-extender"

export function AttachementFileInput({
  form,
}: {
  form: UseFormReturnType<Issue>
}) {
  return (
    <FileInput
      label="Attachment"
      placeholder="Upload Files"
      icon={<IconFileUpload />}
      multiple
      disabled
      {...form.getInputProps("attachment")}
    />
  )
}
