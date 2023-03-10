import { ActionIcon } from "@mantine/core"
import { IconCloudDownload } from "@tabler/icons"
import { Attachment } from "project-extender"
import { useEffect, useState } from "react"
import { downloadAttachment as getAttachmentDownloadLink } from "../../helpers/queryFetchers"

export function AttachmentDownloadBtn(props: { attachment: Attachment }) {
  const [link, setLink] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!link) {
      getAttachmentDownloadLink(props.attachment.id).then((s) => setLink(s))
    }
  }, [link])

  return (
    <ActionIcon
      color="dark"
      size="lg"
      radius="xs"
      variant="outline"
      disabled={link === undefined}
      loading={link === undefined}
    >
      {link && (
        <a download={props.attachment.filename} href={link}>
          <IconCloudDownload color="black" />
        </a>
      )}
    </ActionIcon>
  )
}
