import { FileButton, Group, Button } from "@mantine/core"
import { IconPlus } from "@tabler/icons"
import { Attachment } from "project-extender"
import { addAttachments } from "../helpers/queryFetchers"

export function AttachmentUploadBtn(props: {
  id: string
  addAttachment: (a: Attachment) => void
}) {
  const performUpload = async (f: File): Promise<void> => {
    if (f) {
      const form = new FormData()
      form.append("file", f, f.name)
      await addAttachments(props.id, form)
        .then((attach) => {
          props.addAttachment(attach)
        })
        .catch((err) => err)
    }
  }

  return (
    <Group position="center">
      <FileButton onChange={performUpload} accept="*/*">
        {(properties) => (
          <Button
            {...properties}
            variant="subtle"
            color="dark"
            radius="xs"
            size="xs"
            compact
          >
            <IconPlus color="black" />
          </Button>
        )}
      </FileButton>
    </Group>
  )
}
