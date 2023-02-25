import { Text, ActionIcon, Card, Group, HoverCard } from "@mantine/core"
import { IconTrash } from "@tabler/icons"
import { useEffect, useState } from "react"
import { Attachment } from "project-extender"
import { deleteAttachment } from "../helpers/queryFetchers"
import { Thumbnail } from "./AttachmentThumbnail"
import { AttachmentDownloadBtn } from "./AttachmentDownloadBtn"

export function AttachmentCard(props: { attachments: Attachment[] }) {
  const [action, setAction] = useState<boolean>(false)

  const performDelete = (attachmentId: string): void => {
    deleteAttachment(attachmentId)
      .then(() => {
        const match = props.attachments.find((att) => att.id === attachmentId)
        if (match) {
          const idx = props.attachments.indexOf(match)
          props.attachments.splice(idx, 1)
        }
        setAction(!action)
      })
      .catch(() => {})
  }

  useEffect(() => {}, [action])

  return (
    <Group spacing="xs" grow={props.attachments.length > 1}>
      {props.attachments.map((attach) => (
        <HoverCard shadow="md" position="bottom-end">
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
                  radius="xs"
                  variant="outline"
                  onClick={() => performDelete(attach.id)}
                >
                  <IconTrash />
                </ActionIcon>
              </Group>
            </HoverCard.Dropdown>
          </Card>
        </HoverCard>
      ))}
    </Group>
  )
}
