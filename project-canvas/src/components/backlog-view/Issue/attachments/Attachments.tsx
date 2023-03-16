import {
  Text,
  Group,
  Paper,
  FileButton,
  Button,
  ActionIcon,
  Card,
  HoverCard,
  Image,
  Stack,
} from "@mantine/core"
import { IconCloudDownload, IconPlus, IconTrash } from "@tabler/icons"
import { showNotification } from "@mantine/notifications"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import FileSaver from "file-saver"
import { Attachment } from "project-extender"
import { addAttachmentMutation, deleteAttachmentMutation } from "./queries"
import {
  downloadAttachment,
  // getAttachmentThumbnail,
  // getAttachmentThumbnail,
  getResource,
} from "./queryFunctions"

export function Attachments(props: {
  issueKey: string
  attachments: Attachment[]
}) {
  const resourceQuery = useQuery({
    queryKey: ["resource"],
    queryFn: getResource,
  })

  const resource = resourceQuery?.data

  /*    const fetchThumb = (id: string): Promise<string | undefined> =>
    getAttachmentThumbnail(id, resource!)
      .then((b) => URL.createObjectURL(b))
      .catch(() => undefined) */

  /*   const getThumbnailQuery = (id: string) =>
    useQuery({
      queryKey: ["thumbnail", id],
      queryFn: () => fetchThumb(id),
      enabled: !!resource,
    })

  const thumbnailQueries = resource
    ? props.attachments.map((att) => ({ id: att.id, url: fetchThumb(att.id) }))
    : [] */

  /*     const [promises, setPromises] = useState<{
      attId: string
      url: (string | undefined)
    }[]>([]) 
    
  useEffect(() => {
    Promise.all(
        props.attachments.map((a: Attachment) => ({
          attId: a.id,
          url: fetchThumb(a.id),
        }))
      ).then(ps => setPromises(ps.map(ob => ob.url)))

  }, [props.attachments]) */

  const queryClient = useQueryClient()
  const addAttachmentMutationLocal = addAttachmentMutation(queryClient)
  const deleteAttachmentMutationLocal = deleteAttachmentMutation(queryClient)

  const performDelete = (attachmentId: string): void => {
    if (resource)
      deleteAttachmentMutationLocal.mutate({ attachmentId, resource })
  }

  const performUpload = async (f: File): Promise<void> => {
    const form = new FormData()
    form.append("file", f, f.name)
    const issueIdOrKey = props.issueKey
    if (resource)
      addAttachmentMutationLocal.mutate({ issueIdOrKey, resource, form })
  }

  return (
    <>
      <Text>cgchh</Text>
      <Text>kvjvjv</Text>
      <Group position="left" align="flex-start" spacing="xs">
        <Text color="dimmed" mb="sm">
          Attachments
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
                <IconPlus color="black" />
              </Button>
            )}
          </FileButton>
        </Group>
      </Group>
      <Paper mb="lg" mr="sm">
        {resource && (
          <Group>
            {props.attachments.map((attach: Attachment) => {
              const fetchFile: Promise<Blob> = downloadAttachment(
                attach.id,
                resource
              )

              /*               const urlData = thumbnailQueries.find(
                (q) => q.id === attach.id
              )?.url */

              const handleDownload = () => {
                fetchFile
                  .then((blob) => FileSaver.saveAs(blob, attach.filename))
                  .catch(() =>
                    showNotification({
                      message: `File couldn't be uploaded! 😢`,
                      color: "red",
                    })
                  )
              }

              return (
                <HoverCard key={attach.id} shadow="md" position="bottom-end">
                  <Card
                    key={attach.id}
                    shadow="sm"
                    p="xl"
                    radius="md"
                    withBorder
                  >
                    <Card.Section>
                      <HoverCard.Target>
                        <Stack>
                          <Image
                            height={100}
                            src={null}
                            alt="With default placeholder"
                            withPlaceholder
                          />
                        </Stack>
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
                        <ActionIcon
                          color="dark"
                          size="lg"
                          radius="xs"
                          variant="outline"
                        >
                          <IconCloudDownload
                            color="black"
                            onClick={handleDownload}
                          />
                        </ActionIcon>

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
              )
            })}
          </Group>
        )}
      </Paper>
    </>
  )
}
