/* eslint-disable no-console */
import { Image } from "@mantine/core"
import { useEffect, useState } from "react"
import { getAttachmentThumbnail } from "../helpers/queryFetchers"

export function Thumbnail(props: { thumb: string }) {
  const placeholder: string =
    "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"

  const [url, setUrl] = useState<string>(placeholder)
  useEffect(() => {
    getAttachmentThumbnail(props.thumb)
      .then((b) => webkitURL.createObjectURL(b))
      .then((s) => setUrl(s))
      .catch((e: Error) => e)
  }, [])

  return <Image src={url} />
}
