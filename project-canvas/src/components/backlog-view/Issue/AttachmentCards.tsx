import {
  Text,
  ActionIcon,
  Card,
  Group,
  HoverCard,
  SimpleGrid,
} from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { useEffect, useState } from "react"
import { Attachment } from "project-extender"
import { deleteAttachment } from "../helpers/queryFetchers"
import { Thumbnail } from "./AttachmentThumbnail"
import { AttachmentDownloadBtn } from "./AttachmentDownloadBtn"

export function AttachmentCards(props: { attachments: Attachment[] }) {
  const [valid, setValid] = useState<boolean>(true)

  const invalidate = (): void => {
    setValid(!valid)
  }
  const performDelete = (attachmentId: string): void => {
    deleteAttachment(attachmentId)
      .then(() => {
        const match = props.attachments.find((att) => att.id === attachmentId)
        if (match) {
          const idx = props.attachments.indexOf(match)
          props.attachments.splice(idx, 1)
          invalidate()
        }
      })
      .catch(() => {})
  }

  useEffect(() => {}, [valid])

  return (
    <SimpleGrid cols={6} spacing="xs" verticalSpacing="xs">
      {props.attachments.map((attach: Attachment) => (
        <HoverCard key={attach.id} shadow="md" position="bottom-end">
          <Card key={attach.id} shadow="sm" p="xl" radius="md" withBorder>
            <Card.Section>
              <HoverCard.Target>
                <div>
                  <Thumbnail attachmentId={attach.id} />
                </div>
              </HoverCard.Target>
            </Card.Section>
            <Card.Section p="xs">
              <Text size="xs" color="dimmed" truncate>
                {attach.filename}
              </Text>
              <Text size="xs" color="dimmed" truncate>
                {attach.created}
              </Text>
            </Card.Section>
            <HoverCard.Dropdown p={0}>
              <Group spacing={0}>
                <AttachmentDownloadBtn attachment={attach} />
                <ActionIcon
                  size="lg"
                  color="black"
                  radius="xs"
                  variant="outline"
                  onClick={() => performDelete(attach.id)}
                >
                  <IconTrash color="black" />
                </ActionIcon>
              </Group>
            </HoverCard.Dropdown>
          </Card>
        </HoverCard>
      ))}
    </SimpleGrid>
  )
}
