/* eslint-disable no-console */
import { Image } from "@mantine/core"
import { useEffect, useState } from "react"
import { getAttachmentThumbnail } from "../helpers/queryFetchers"

export function Thumbnail(props: { attachmentId: string }) {
  const [url, setUrl] = useState<string>("")
  useEffect(() => {
    getAttachmentThumbnail(props.attachmentId).then((s) => setUrl(s))
  }, [])

  return <Image src={url} withPlaceholder />
}
