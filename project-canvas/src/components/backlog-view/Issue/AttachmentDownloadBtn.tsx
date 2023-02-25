import { ActionIcon } from "@mantine/core"
import { IconCloudDownload } from "@tabler/icons"
import { Attachment } from "project-extender"
import { useEffect, useState } from "react"
import { downloadAttachment as getAttachmentDownloadLink } from "../helpers/queryFetchers"

export function AttachmentDownloadBtn(props: { attachment: Attachment }) {
  const [link, setLink] = useState<string>("")

  useEffect(() => {
    getAttachmentDownloadLink(props.attachment.id).then((s) => setLink(s))
  }, [])

  return (
    <a download={props.attachment.filename} href={link}>
      <ActionIcon size="lg" radius="xs" variant="outline">
        <IconCloudDownload />
      </ActionIcon>
    </a>
  )
}
