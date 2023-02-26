/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import { useState } from "react"
import { FileButton, ActionIcon } from "@mantine/core"
import { IconPlus } from "@tabler/icons"

export function AttachmentUploadBtn({ ...props }) {
  const [files, setFiles] = useState<File[]>([])
  return (
    <FileButton onChange={setFiles} accept="*" multiple>
      {(props) => (
        <ActionIcon {...props}>
          <IconPlus color="black" />
        </ActionIcon>
      )}
    </FileButton>
  )
}
