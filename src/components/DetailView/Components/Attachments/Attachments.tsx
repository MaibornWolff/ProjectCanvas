import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  FileButton,
  Flex,
  Group,
  HoverCard,
  Image,
  LoadingOverlay,
  Paper,
  Text,
  Tooltip,
} from "@mantine/core"
import {IconCloudDownload, IconPlus, IconTrash} from "@tabler/icons"
import {showNotification} from "@mantine/notifications"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import FileSaver from "file-saver"
import {Attachment} from "types"
import {addAttachmentMutation, deleteAttachmentMutation} from "./queries"
import {downloadAttachment, getAttachmentThumbnail} from "./queryFunctions"

export function Attachments(props: {
  issueKey: string
  attachments: Attachment[]
}) {
  const fetchThumb = (id: string): Promise<string | undefined> =>
    getAttachmentThumbnail(id)
      .then((b) => URL.createObjectURL(b))
      .catch(() => undefined)

  const { data: thumbnails, isLoading: thumbnailsLoading } = useQuery({
    queryKey: ["thumbnails", props.attachments],
    queryFn: () => {
      const thumbnailPromises = props.attachments?.map(async (attachment) => ({
        id: attachment.id,
        url: await fetchThumb(attachment.id),
      }))
      return Promise.all(thumbnailPromises)
    },
    enabled: !!props.attachments,
  })

  const queryClient = useQueryClient()
  const addAttachmentMutationLocal = addAttachmentMutation(queryClient)
  const deleteAttachmentMutationLocal = deleteAttachmentMutation(queryClient)

  const performDelete = (attachmentId: string): void => {
    deleteAttachmentMutationLocal.mutate(attachmentId)
  }

  const performUpload = async (f: File): Promise<void> => {
    const form = new FormData()
    form.append("file", f, f.name)
    const issueIdOrKey = props.issueKey
    addAttachmentMutationLocal.mutate({ issueIdOrKey, form })
  }

  const label: string =
    props.attachments && props.attachments.length === 0
      ? "Attachments"
      : `Attachments (${props.attachments ? props.attachments.length : 0})`

  return (
    <>
      <Group position="left" align="flex-start" spacing="xs">
        <Text color="dimmed" mb="sm">
          {label}
        </Text>
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
                <IconPlus />
              </Button>
            )}
          </FileButton>
        </Group>
      </Group>
      <Paper mb="lg" mr="sm">
        <Group>
          {props.attachments &&
            props.attachments.map((attachment: Attachment) => {
              const fetchFile: Promise<Blob> = downloadAttachment(attachment.id)
              const handleDownload = () => {
                fetchFile
                  .then((blob) => FileSaver.saveAs(blob, attachment.filename))
                  .catch(() =>
                    showNotification({
                      message: `File couldn't be uploaded! 😢`,
                      color: "red",
                    })
                  )
              }

              return (
                <Tooltip
                  label={attachment.filename}
                  key={attachment.id}
                  inline
                >
                  <Box>
                    <HoverCard
                      shadow="md"
                      position="top-end"
                      key={attachment.id}
                      offset={-20}
                    >
                      <Card
                        shadow="sm"
                        radius="md"
                        w={150}
                        h={180}
                        withBorder
                      >
                        <HoverCard.Target>
                          <Flex
                            direction="column"
                            justify="space-between"
                            p={0}
                          >
                            <Card.Section>
                              <Center>
                                <LoadingOverlay
                                  overlayOpacity={0.3}
                                  overlayColor="#c5c5c5"
                                  exitTransitionDuration={5000}
                                  visible={thumbnailsLoading}
                                />

                                <Image
                                  height={100}
                                  fit="contain"
                                  src={
                                    !thumbnailsLoading &&
                                    thumbnails &&
                                    thumbnails.find(
                                      (thumbnail) =>
                                        thumbnail.id === attachment.id
                                    )?.url
                                      ? thumbnails.find(
                                        (thumbnail) =>
                                          thumbnail.id === attachment.id
                                      )?.url
                                      : null
                                  }
                                  alt={`${attachment.filename}`}
                                  withPlaceholder
                                />
                              </Center>
                            </Card.Section>
                            <Card.Section p="xs">
                              <Box>
                                <Text size="xs" color="dimmed" truncate>
                                  {attachment.filename}
                                </Text>
                                <Text
                                  size="xs"
                                  fw={600}
                                  color="dimmed"
                                  truncate
                                >
                                  {new Intl.DateTimeFormat("en-GB", {
                                    dateStyle: "short",
                                    timeStyle: "short",
                                  }).format(new Date(attachment.created))}
                                </Text>
                              </Box>
                            </Card.Section>
                          </Flex>
                        </HoverCard.Target>
                        <HoverCard.Dropdown p={0}>
                          <Group spacing={0}>
                            <ActionIcon
                              color="dark"
                              size="lg"
                              radius="xs"
                              variant="subtle"
                              onMouseOver={(event) => {
                                const target = event.currentTarget
                                target.style.border = "1px solid"
                              }}
                              onMouseLeave={(event) => {
                                const target = event.currentTarget
                                target.style.border = "1px solid transparent"
                              }}
                            >
                              <IconCloudDownload onClick={handleDownload} />
                            </ActionIcon>

                            <ActionIcon
                              size="lg"
                              color="dark"
                              radius="xs"
                              variant="subtle"
                              onMouseOver={(event) => {
                                const target = event.currentTarget
                                target.style.border = "1px solid"
                              }}
                              onMouseLeave={(event) => {
                                const target = event.currentTarget
                                target.style.border = "1px solid transparent"
                              }}
                              onClick={() => performDelete(attachment.id)}
                            >
                              <IconTrash />
                            </ActionIcon>
                          </Group>
                        </HoverCard.Dropdown>
                      </Card>
                    </HoverCard>
                  </Box>
                </Tooltip>
              )
            })}
        </Group>
      </Paper>
    </>
  )
}
