import { useEffect, useState } from "react"
import {
  Modal,
  Button,
  Group,
  Avatar,
  Flex,
  Badge,
  Collapse,
  Text,
  Stack,
  Breadcrumbs,
  Card,
  Space,
  NavLink,
  Paper,
  Popover,
  Select,
} from "@mantine/core"
import {
  IssueBean,
  IssueTypeDetails,
  PageOfComments,
  Comment,
  Attachment,
} from "project-extender"
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { RichTextEditor } from "@mantine/rte"
import { DateTime } from "ts-luxon"
import { useDisclosure } from "@mantine/hooks"
import { IconChevronDown } from "@tabler/icons"

interface ImageSize {
  text: string
  size: number
}

interface ImageTypeSizes {
  avatarImageSize: ImageSize
  iconImageSize: ImageSize
}

// Labels
const SPRINT: string = "Sprint"
const STORY_POINTS: string = "Story point estimate"
const CHILD_ISSUES: string = "Child Issues"
const NONE: string = "None"
const STATUS: string = "Done"
const ACTIVITY: string = "Activity"
const SHOW: string = "Show:"
const EPIC_LINK: string = "Epic link"
const DETAILS: string = "Details"

const IMAGE_SIZES: ImageTypeSizes = {
  avatarImageSize: { text: "32x32", size: 32 },
  iconImageSize: { text: "16x16", size: 16 },
}

const LOCALE: string = "en-US"

interface FieldProps {
  header?: string | undefined
  dimmed?: boolean | undefined
  bold?: number | undefined
  textSize?: number | "xs" | "sm" | "md" | "lg" | "xl"
  child?: ReactJSXElement | undefined
}

interface AvatarProps {
  url?: string | undefined
  size?: number
  radius?: number | "xs" | "sm" | "md" | "lg" | "xl"
  default?: boolean | undefined
  name?: string | undefined
  textSize?: number | "xs" | "sm" | "md" | "lg" | "xl"
}

export interface DetailViewProps {
  opened: boolean
  setOpened(b: boolean): void
  keyOrId: string
}

export function DetailView({ opened, setOpened, keyOrId }: DetailViewProps) {
  const [openedDetail, setOpenedDetail] = useState(true)
  const [issue, setIssue] = useState<IssueBean>({})
  const [pageOfComments, setPageOfComments] = useState<PageOfComments>({})
  const [openedPopOver, { close, open }] = useDisclosure(false)

  const fetchData = (idOrKey: string): void => {
    Promise.all(
      [
        `${import.meta.env.VITE_EXTENDER}/issue/${idOrKey}`,
        `${import.meta.env.VITE_EXTENDER}/issue/${idOrKey}/comments`,
      ].map((request) =>
        fetch(request)
          .then((res) => res.json())
          .catch((err) => err)
      )
    )
      .then((res) =>
        res.forEach((data, idx) => {
          if (idx === 0) {
            setIssue(data)
            console.log(data)
          } else {
            setPageOfComments(data)
          }
        })
      )
      .then((res) => res)
      .catch((err) => err)
  }

  useEffect(() => {
    fetchData(keyOrId)
  }, [opened])

  const createAvatar = (avatarProps: AvatarProps): ReactJSXElement => (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="wrap"
    >
      {(avatarProps.url || avatarProps.default) && (
        <Avatar
          src={avatarProps.url}
          size={avatarProps.size}
          radius={avatarProps.radius}
        />
      )}
      {(avatarProps.name || avatarProps.default) && (
        <Text fz={avatarProps.textSize || "sm"} fw={500}>
          {avatarProps.name || "Unassigned"}
        </Text>
      )}
    </Flex>
  )

  const createField = (fieldProps: FieldProps): ReactJSXElement => (
    <Flex
      gap="xs"
      justify="flex-start"
      align="stretch"
      direction="column"
      wrap="wrap"
    >
      {fieldProps.header && (
        <Text
          fz={fieldProps.textSize || "xs"}
          c={fieldProps.dimmed ? "dimmed" : "dark"}
          fw={fieldProps.bold || 500}
        >
          {fieldProps.header}
        </Text>
      )}
      {fieldProps.child}
    </Flex>
  )

  const createRow = (child: ReactJSXElement): ReactJSXElement => (
    <Flex
      gap="xs"
      justify="flex-start"
      align="flex-start"
      direction="row"
      wrap="wrap"
    >
      {child}
    </Flex>
  )

  const createText = (text: string | undefined): ReactJSXElement => (
    <Text fz="sm" fw={500}>
      {text}
    </Text>
  )

  const findCustomFieldByName = (fieldName: string): string | undefined => {
    const result = issue?.names
      ? Object.entries(issue.names).find(
          (field: [key: string, value: string]) => field[1] === fieldName
        )?.[0]
      : undefined
    return result || undefined
  }

  const title: ReactJSXElement = (
    <Breadcrumbs>
      {issue?.fields?.parent && (
        <NavLink
          label={
            <Group spacing="xs" position="left" align="center">
              {createAvatar({
                url: issue?.fields?.parent?.fields?.issuetype?.iconUrl,
                size: IMAGE_SIZES.avatarImageSize.size,
              })}
              <Text
                size="sm"
                color="blue"
                td={
                  issue?.fields?.parent?.fields?.status?.name === STATUS
                    ? "line-through"
                    : "none"
                }
                sx={{
                  ":hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                {issue?.fields?.parent?.key}
              </Text>
            </Group>
          }
          onClick={() => fetchData(issue?.fields?.parent?.key!)}
        />
      )}
      <NavLink
        label={
          <Group spacing="xs">
            {createAvatar({
              url: issue?.fields?.issuetype?.iconUrl,
              size: IMAGE_SIZES.avatarImageSize.size,
            })}
            <Text
              size="sm"
              color="blue"
              td={
                issue?.fields?.status?.name === STATUS ? "line-through" : "none"
              }
              sx={{
                ":hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
            >
              {issue?.key}
            </Text>
          </Group>
        }
      />
    </Breadcrumbs>
  )

  // TODO: Mantine RichTextEditor isn't able to handle embedded images
  const description: ReactJSXElement = createField({
    header: issue?.names?.description,
    dimmed: false,
    bold: 600,
    textSize: "sm",
    child: (
      <RichTextEditor readOnly value={issue?.renderedFields?.description} />
    ),
  })

  const labels: ReactJSXElement = createField({
    header: issue?.names?.labels,
    child: createRow(
      issue?.fields?.labels?.length > 0
        ? issue?.fields?.labels?.map((label: string) => (
            <Badge key={label} color="indigo" variant="light">
              <Text>{label}</Text>
            </Badge>
          ))
        : createText(NONE)
    ),
  })

  const created: ReactJSXElement = createField({
    header: issue?.names?.created,
    child: createRow(createText(issue?.renderedFields?.created)),
  })

  const updated: ReactJSXElement = createField({
    header: issue?.names?.updated,
    child: createRow(createText(issue?.renderedFields?.updated)),
  })

  const summary: ReactJSXElement = createField({
    header: issue?.fields?.summary,
    textSize: "xl",
    bold: 1000,
  })

  const sprint: ReactJSXElement = createField({
    header: SPRINT,
    child: createRow(
      issue?.fields &&
        findCustomFieldByName(SPRINT) &&
        issue?.fields[findCustomFieldByName(SPRINT)!] ? (
        <>
          <Text fz="sm" fw={500}>
            {issue.fields[findCustomFieldByName(SPRINT)!][0].name}
          </Text>
          {issue.fields[findCustomFieldByName(SPRINT)!].length > 1 && (
            <Popover
              width={200}
              position="top"
              withArrow
              shadow="md"
              opened={openedPopOver}
            >
              <Popover.Target>
                <Badge
                  color="gray"
                  size="lg"
                  onMouseEnter={open}
                  onMouseLeave={close}
                >
                  {`+${
                    issue.fields[findCustomFieldByName(SPRINT)!].length - 1
                  }`}
                </Badge>
              </Popover.Target>
              <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                {issue.fields[findCustomFieldByName(SPRINT)!]
                  .filter(
                    (item: { name: string; state: string }, idx: number) =>
                      idx !== 0 /* && item.state === "active" */
                  )
                  .map((item: { name: string }) => (
                    <Text size="sm">{item.name}</Text>
                  ))}
              </Popover.Dropdown>
            </Popover>
          )}
        </>
      ) : (
        createText(NONE)
      )
    ),
  })

  const storyPoints: ReactJSXElement = createField({
    header: STORY_POINTS,
    child: createRow(
      createText(
        issue?.fields &&
          findCustomFieldByName(STORY_POINTS) &&
          issue.fields[findCustomFieldByName(STORY_POINTS)!]
          ? issue.fields[findCustomFieldByName(STORY_POINTS)!]
          : NONE
      )
    ),
  })

  const epicLinks: ReactJSXElement = createField({
    header: EPIC_LINK,
    child: createRow(
      createText(
        issue?.fields &&
          findCustomFieldByName(EPIC_LINK) &&
          issue.fields[findCustomFieldByName(EPIC_LINK)!]
          ? issue.fields[findCustomFieldByName(EPIC_LINK)!]
          : NONE
      )
    ),
  })

  const assignee: ReactJSXElement = createField({
    header: issue?.names?.assignee,
    child: createAvatar({
      url: issue?.fields?.assignee?.avatarUrls[
        IMAGE_SIZES.avatarImageSize.text
      ],
      size: IMAGE_SIZES.avatarImageSize.size,
      radius: "xl",
      name: issue?.fields?.assignee?.displayName,
      default: true,
    }),
  })

  const reporter: ReactJSXElement = createField({
    header: issue?.names?.reporter,
    child: createAvatar({
      url: issue?.fields?.reporter?.avatarUrls[
        IMAGE_SIZES.avatarImageSize.text
      ],
      size: IMAGE_SIZES.avatarImageSize.size,
      radius: "xl",
      name: issue?.fields?.reporter?.displayName,
      default: true,
    }),
  })

  const subtasks: ReactJSXElement = createField({
    header: CHILD_ISSUES,
    dimmed: false,
    bold: 600,
    textSize: "sm",
    child: (
      <Stack spacing="xs">
        {issue?.fields?.subtasks?.map((task: IssueBean) => (
          <Paper shadow="xs" radius="xs" p="xs">
            <NavLink
              label={
                <Group spacing="xs" position="left" align="center">
                  <Avatar
                    src={(task?.fields?.issuetype as IssueTypeDetails).iconUrl}
                    size={IMAGE_SIZES.iconImageSize.size}
                  />
                  <Text
                    size="sm"
                    color="blue"
                    td={
                      issue?.fields?.status?.name === STATUS
                        ? "line-through"
                        : "none"
                    }
                    sx={{
                      ":hover": {
                        textDecoration: "underline",
                        cursor: "pointer",
                      },
                    }}
                  >
                    {task?.key}
                  </Text>
                  <Text truncate>{task?.fields?.summary}</Text>
                </Group>
              }
              onClick={() => {
                fetchData(task.key!)
              }}
            />
          </Paper>
        ))}
      </Stack>
    ),
  })

  const comments: ReactJSXElement = createField({
    header: ACTIVITY,
    dimmed: false,
    bold: 600,
    textSize: "sm",
    child: (
      <>
        <Group spacing="xs">
          <Text size="sm">{SHOW}</Text>
          <Button variant="light" color="gray" size="xs" compact disabled>
            <Text>{issue?.names?.comment}</Text>
          </Button>
          <Badge>{pageOfComments?.comments?.length || 0}</Badge>
        </Group>
        <Stack>
          {pageOfComments?.comments?.map((comment: Comment) => (
            <Stack>
              <Group>
                <Avatar
                  src={comment?.author?.avatarUrls?.["32x32"]}
                  size={32}
                  radius="xl"
                />
                <Text fz="sm" fw={600}>
                  {comment?.author?.displayName}
                </Text>
                <Text fz="xs">
                  {comment?.updated
                    ? DateTime.fromISO(comment?.updated)
                        .setLocale(LOCALE)
                        .toLocaleString(DateTime.DATETIME_MED)
                    : NONE}
                </Text>
              </Group>
              <RichTextEditor readOnly value={comment?.renderedBody} />
            </Stack>
          ))}
        </Stack>
      </>
    ),
  })

  const attachments: ReactJSXElement = createField({
    header: issue?.names?.attachment,
    dimmed: false,
    bold: 600,
    textSize: "sm",
    child: (
      <Stack spacing="xs">
        {issue?.fields?.attachment &&
          issue?.fields.attachment.map((att: Attachment) => (
            <Paper shadow="xs" radius="xs" p="xs">
              <Group position="apart" spacing="xs">
                <Text truncate>{att.filename}</Text>
                {att.created && (
                  <Text>
                    {DateTime.fromISO(att.created)
                      .setLocale(LOCALE)
                      .toLocaleString(DateTime.DATETIME_MED)}
                  </Text>
                )}
              </Group>
            </Paper>
          ))}
      </Stack>
    ),
  })

  return (
    <Modal
      size="80%"
      opened={opened}
      onClose={() => setOpened(false)}
      title={title}
      overlayBlur={0}
      overflow="inside"
    >
      <Flex
        gap="xl"
        justify="flex-start"
        align="flex-start"
        direction="row"
        wrap="wrap"
      >
        <Stack style={{ flex: "3 1 auto" }}>
          {summary}
          {description}
          {attachments}
          {subtasks}
          {comments}
        </Stack>
        <Stack style={{ flex: "1 1 auto" }}>
          <Select
            rightSection={<IconChevronDown />}
            data={[
              {
                value: issue?.fields?.status?.name,
                label: issue?.fields?.status?.name,
              },
            ]}
            placeholder={issue?.fields?.status?.name}
            style={{ maxWidth: "30%" }}
            disabled
          />
          <Card shadow="sm" radius="md" withBorder>
            <Card.Section>
              <Button
                onClick={() => setOpenedDetail(!openedDetail)}
                variant="outline"
                fullWidth
              >
                {DETAILS}
              </Button>
            </Card.Section>
            <Card.Section px="xs">
              <Stack>
                <Collapse in={openedDetail}>
                  <Space h="xs" />
                  <Stack spacing="md">
                    {assignee}
                    {labels}
                    {sprint}
                    {storyPoints}
                    {epicLinks}
                    {reporter}
                  </Stack>
                  <Space h="xs" />
                </Collapse>
              </Stack>
            </Card.Section>
          </Card>
          {created}
          {updated}
        </Stack>
      </Flex>
    </Modal>
  )
}
