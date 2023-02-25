import {
  Text,
  ActionIcon,
  Card,
  Group,
  HoverCard,
  Container,
} from "@mantine/core"
import { IconCloudDownload, IconTrash } from "@tabler/icons"
import { Thumbnail } from "./Thumbnail"

interface Attachment {
  self: string
  id: string
  filename: string
  created: string
  mimeType: string
  content: string
}

export function AttachmentCard(props: { attachments: Attachment[] }) {
  return (
    <Group>
      {props.attachments.map((attach) => (
        <Card
          key={attach.id}
          shadow="sm"
          p="xl"
          radius="md"
          component="a"
          href="https://mantine.dev/"
          withBorder
        >
          <Card.Section>
            <HoverCard shadow="md" position="top-end">
              <HoverCard.Target>
                <Thumbnail attachmentId={attach.id} />
              </HoverCard.Target>
              <HoverCard.Dropdown p={0}>
                <Group spacing={0}>
                  <ActionIcon
                    size="lg"
                    radius="xs"
                    variant="outline"
                    onClick={() => {}}
                  >
                    <IconCloudDownload />
                  </ActionIcon>
                  <ActionIcon
                    size="lg"
                    radius="xs"
                    variant="outline"
                    onClick={() => {}}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Group>
              </HoverCard.Dropdown>
            </HoverCard>
          </Card.Section>
          <Card.Section p="xs">
            <Container size={200}>
              <Text size="xs" color="dimmed" truncate>
                {attach.filename}
              </Text>
              <Text size="xs" color="dimmed" truncate>
                {attach.created}
              </Text>
            </Container>
          </Card.Section>
        </Card>
      ))}
    </Group>
  )
}
