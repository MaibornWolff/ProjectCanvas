import { Image } from "@mantine/core"
import { useEffect, useState } from "react"
import { getAttachmentThumbnail } from "../helpers/queryFetchers"

export function Thumbnail(props: { attachmentId: string }) {
  const [url, setUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!url) {
      getAttachmentThumbnail(props.attachmentId)
        .then((s) => setUrl(s))
        .catch(() => setUrl(undefined))
    }
  }, [url])

  return (
    <Image
      src={url}
      width="100%"
      alt={`Item #${props.attachmentId}`}
      withPlaceholder
    />
  )
}
