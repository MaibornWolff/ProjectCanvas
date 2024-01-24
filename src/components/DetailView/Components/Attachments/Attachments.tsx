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
  Flex,
  Box,
  Tooltip,
  Center,
  LoadingOverlay,
} from "@mantine/core";
import { IconCloudDownload, IconPlus, IconTrash } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FileSaver from "file-saver";
import { Attachment } from "types";
import { addAttachmentMutation, deleteAttachmentMutation } from "./queries";
import { downloadAttachment, getAttachmentThumbnail, getResource } from "./queryFunctions";

export function Attachments(props: {
  issueKey: string,
  attachments: Attachment[],
}) {
  const resourceQuery = useQuery({
    queryKey: ["resource"],
    queryFn: getResource,
  });

  const resource = resourceQuery?.data;

  const fetchThumb = (id: string): Promise<string | undefined> => getAttachmentThumbnail(id, resource!)
    .then((b) => URL.createObjectURL(b))
    .catch(() => undefined);

  const { data: thumbnails, isLoading: thumbnailsLoading } = useQuery({
    queryKey: ["thumbnails", props.attachments],
    queryFn: async () => {
      const thumbnailPromises = props.attachments?.map(async (attachment) => ({
        id: attachment.id,
        url: await fetchThumb(attachment.id),
      }));
      const thumbnailResults = await Promise.all(thumbnailPromises);
      return thumbnailResults;
    },
    enabled: !!resource && !!props.attachments,
  });

  const queryClient = useQueryClient();
  const addAttachmentMutationLocal = addAttachmentMutation(queryClient);
  const deleteAttachmentMutationLocal = deleteAttachmentMutation(queryClient);

  const performDelete = (attachmentId: string): void => {
    if (resource) deleteAttachmentMutationLocal.mutate({ attachmentId, resource });
  };

  const performUpload = async (file: File | null): Promise<void> => {
    if (!file) {
      return;
    }

    const form = new FormData();
    form.append("file", file, file.name);
    const issueIdOrKey = props.issueKey;
    if (resource) addAttachmentMutationLocal.mutate({ issueIdOrKey, resource, form });
  };

  const label: string = props.attachments && props.attachments.length === 0
    ? "Attachments"
    : `Attachments (${props.attachments ? props.attachments.length : 0})`;

  return (
    <>
      <Group justify="left" align="flex-start" gap="xs">
        <Text c="dimmed" mb="sm">
          {label}
        </Text>
        <Group justify="center">
          <FileButton onChange={performUpload} accept="*/*">
            {(properties) => (
              <Button
                {...properties}
                variant="subtle"
                color="dark"
                radius="xs"
                size="compact-xs"
              >
                <IconPlus />
              </Button>
            )}
          </FileButton>
        </Group>
      </Group>
      <Paper mb="lg" mr="sm">
        {resource && (
          <Group>
            {props.attachments
              && props.attachments.map((attachment: Attachment) => {
                const fetchFile: Promise<Blob> = downloadAttachment(
                  attachment.id,
                  resource,
                );
                const handleDownload = () => {
                  fetchFile
                    .then((blob) => FileSaver.saveAs(blob, attachment.filename))
                    .catch(() => showNotification({
                      message: "File couldn't be uploaded! 😢",
                      color: "red",
                    }));
                };

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
                                    overlayProps={{
                                      opacity: 0.3,
                                      color: "#c5c5c5",
                                    }}
                                    transitionProps={{ exitDuration: 5000 }}
                                    visible={thumbnailsLoading}
                                  />

                                  <Image
                                    height={100}
                                    fit="contain"
                                    src={
                                      !thumbnailsLoading
                                      && thumbnails
                                      && thumbnails.find(
                                        (thumbnail) => thumbnail.id === attachment.id,
                                      )?.url
                                        ? thumbnails.find(
                                          (thumbnail) => thumbnail.id === attachment.id,
                                        )?.url
                                        : null
                                    }
                                    alt={`${attachment.filename}`}
                                    fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                                  />
                                </Center>
                              </Card.Section>
                              <Card.Section p="xs">
                                <Box>
                                  <Text size="xs" c="dimmed" truncate>
                                    {attachment.filename}
                                  </Text>
                                  <Text size="xs" fw={600} c="dimmed" truncate>
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
                            <Group gap={0}>
                              <ActionIcon
                                color="dark"
                                size="lg"
                                radius="xs"
                                variant="subtle"
                                onMouseOver={(event) => {
                                  const target = event.currentTarget;
                                  target.style.border = "1px solid";
                                }}
                                onMouseLeave={(event) => {
                                  const target = event.currentTarget;
                                  target.style.border = "1px solid transparent";
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
                                  const target = event.currentTarget;
                                  target.style.border = "1px solid";
                                }}
                                onMouseLeave={(event) => {
                                  const target = event.currentTarget;
                                  target.style.border = "1px solid transparent";
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
                );
              })}
          </Group>
        )}
      </Paper>
    </>
  );
}
