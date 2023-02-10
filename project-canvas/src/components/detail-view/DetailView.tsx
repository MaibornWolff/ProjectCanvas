import { useEffect, useState } from "react"
import {
  Modal,
  Button,
  Group,
  Flex,
  Badge,
  Collapse,
  Text,
  Stack,
  Breadcrumbs,
  Card,
  Space,
  Paper,
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
import { IconChevronDown } from "@tabler/icons"
import { AvatarField } from "./AvatarField"
import { Labels } from "./Labels"
import { Field } from "./Field"
import { SimpleText } from "./SimpleText"
import { findCustomFieldByName } from "./utils"
import { CounterBadge } from "./CounterBadge"
import { IssueLink } from "./IssueLink"
import { Row } from "./Row"

const SPRINT: string = "Sprint"
const STORY_POINTS: string = "Story point estimate"
const CHILD_ISSUES: string = "Child Issues"
const NONE: string = "None"
const STATUS: string = "Done"
const ACTIVITY: string = "Activity"
const SHOW: string = "Show:"
const EPIC_LINK: string = "Epic Link"
const DETAILS: string = "Details"
const UNASSIGNED: string = "Unassigned"
const LOCALE: string = "en-US"

interface ImageSize {
  text: string
  size: number
}

interface ImageTypeSizes {
  avatarImageSize: ImageSize
  iconImageSize: ImageSize
}

const IMAGE_DEFAULT_SIZES: ImageTypeSizes = {
  avatarImageSize: { text: "32x32", size: 32 },
  iconImageSize: { text: "32x32", size: 32 },
}

export interface DetailViewProps {
  opened: boolean
  setOpened(b: boolean): void
  keyOrId: string
}

export function DetailView({
  opened,
  setOpened,
  keyOrId,
}: DetailViewProps): ReactJSXElement {
  const [openedDetail, setOpenedDetail] = useState(true)
  const [issue, setIssue] = useState<IssueBean>({})
  const [pageOfComments, setPageOfComments] = useState<PageOfComments>({})

  const fetchData = (idOrKey: string): void => {
    fetch(`${import.meta.env.VITE_EXTENDER}/attachment/${10025}`)
      .then((res) => console.log(res.json()))
      .catch((err) => console.log(err))

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

  const title: ReactJSXElement = (
    <Breadcrumbs>
      {issue?.fields?.parent && (
        <IssueLink
          key={issue?.fields?.parent?.key}
          url={issue?.fields?.parent?.fields?.issuetype?.iconUrl}
          size={IMAGE_DEFAULT_SIZES?.avatarImageSize?.size}
          keyOrId={issue?.fields?.parent?.key}
          td={issue?.fields?.parent?.fields?.status?.name === STATUS}
          onClick={() => fetchData(issue?.fields?.parent?.key)}
        />
      )}
      <IssueLink
        key={issue?.key}
        url={issue?.fields?.issuetype?.iconUrl}
        size={IMAGE_DEFAULT_SIZES?.avatarImageSize?.size}
        keyOrId={issue?.key}
        td={issue?.fields?.status?.name === STATUS}
        onClick={() => {}}
      />
    </Breadcrumbs>
  )

  const description: ReactJSXElement = (
    <Field title={issue?.names?.description}>
      <RichTextEditor readOnly value={issue?.renderedFields?.description} />
    </Field>
  )

  const labels: ReactJSXElement = (
    <Field title={issue?.names?.labels}>
      {issue?.fields?.labels?.length > 0 ? (
        <Labels labels={issue?.fields?.labels} />
      ) : (
        <SimpleText text={NONE} />
      )}
    </Field>
  )

  const created: ReactJSXElement = (
    <Field title={issue?.names?.created}>
      <SimpleText text={issue?.renderedFields?.created} />
    </Field>
  )

  const updated: ReactJSXElement = (
    <Field title={issue?.names?.updated}>
      <SimpleText text={issue?.renderedFields?.updated} />
    </Field>
  )

  const summary: ReactJSXElement = (
    <SimpleText text={issue?.fields?.summary} fw={1000} fz="xl" />
  )

  const sprint: ReactJSXElement = (
    <Field title={SPRINT}>
      {issue?.fields &&
      findCustomFieldByName(issue, SPRINT) &&
      issue?.fields[findCustomFieldByName(issue, SPRINT)!] ? (
        <Row>
          <SimpleText
            text={issue.fields[findCustomFieldByName(issue, SPRINT)!][0].name}
          />

          {issue.fields![findCustomFieldByName(issue, SPRINT)!].length > 1 && (
            <CounterBadge
              length={
                issue.fields![findCustomFieldByName(issue, SPRINT)!].length - 1
              }
              labels={issue
                .fields![findCustomFieldByName(issue, SPRINT)!].filter(
                  (item: { name: string; state: string }, idx: number) =>
                    idx !== 0
                )
                .map((item: { name: string }) => (
                  <SimpleText text={item.name} />
                ))}
            />
          )}
        </Row>
      ) : (
        <SimpleText text={NONE} />
      )}
    </Field>
  )

  const storyPoints: ReactJSXElement = (
    <Field title={STORY_POINTS}>
      <SimpleText
        text={
          issue?.fields &&
          findCustomFieldByName(issue, STORY_POINTS) &&
          issue.fields[findCustomFieldByName(issue, STORY_POINTS)!]
            ? issue.fields[findCustomFieldByName(issue, STORY_POINTS)!]
            : NONE
        }
      />
    </Field>
  )

  const epicLink: ReactJSXElement = (
    <Field title={EPIC_LINK}>
      <SimpleText
        text={
          issue?.fields &&
          findCustomFieldByName(issue, EPIC_LINK) &&
          issue.fields[findCustomFieldByName(issue, EPIC_LINK)!]
            ? issue.fields[findCustomFieldByName(issue, EPIC_LINK)!]
            : NONE
        }
      />
    </Field>
  )

  const assignee: ReactJSXElement = (
    <Field title={issue?.names?.assignee}>
      <AvatarField
        url={
          issue?.fields?.assignee?.avatarUrls[
            IMAGE_DEFAULT_SIZES.avatarImageSize.text
          ]
        }
        size={IMAGE_DEFAULT_SIZES.avatarImageSize.size}
        text={issue?.fields?.assignee?.displayName || UNASSIGNED}
      />
    </Field>
  )

  const reporter: ReactJSXElement = (
    <Field title={issue?.names?.reporter}>
      <AvatarField
        url={
          issue?.fields?.reporter?.avatarUrls[
            IMAGE_DEFAULT_SIZES.avatarImageSize.text
          ]
        }
        size={IMAGE_DEFAULT_SIZES.avatarImageSize.size}
        text={issue?.fields?.reporter?.displayName || UNASSIGNED}
      />
    </Field>
  )

  const subtasks: ReactJSXElement = (
    <Field title={CHILD_ISSUES}>
      {issue?.fields?.subtasks?.map((task: IssueBean) => (
        <Paper shadow="xs" radius="xs">
          <Row>
            <IssueLink
              url={(task?.fields?.issuetype as IssueTypeDetails).iconUrl}
              size={IMAGE_DEFAULT_SIZES.iconImageSize.size}
              keyOrId={task?.key!}
              td={issue?.fields?.status?.name === STATUS}
              text={task?.fields?.summary}
              onClick={() => fetchData(task.key!)}
            />
          </Row>
        </Paper>
      ))}
    </Field>
  )

  const comments: ReactJSXElement = (
    <Field title={ACTIVITY}>
      <Row>
        <Text size="sm">{SHOW}</Text>
        <Button variant="light" color="gray" size="xs" compact disabled>
          <Text>{issue?.names?.comment}</Text>
        </Button>
        <Badge>{pageOfComments?.comments?.length || 0}</Badge>
      </Row>
      {pageOfComments?.comments?.map((comment: Comment) => (
        <Stack spacing="xs">
          <Row>
            <AvatarField
              url={comment?.author?.avatarUrls?.["32x32"]}
              text={comment?.author?.displayName}
            />
            <Text fz="xs">
              {comment?.updated
                ? DateTime.fromISO(comment?.updated)
                    .setLocale(LOCALE)
                    .toLocaleString(DateTime.DATETIME_MED)
                : NONE}
            </Text>
          </Row>
          <RichTextEditor readOnly value={comment?.renderedBody} />
        </Stack>
      ))}
    </Field>
  )

  const attachments: ReactJSXElement = (
    <Field title={issue?.names?.attachment}>
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
    </Field>
  )

  const issueStatus: ReactJSXElement = (
    <Select
      rightSection={<IconChevronDown />}
      data={[
        {
          value: issue?.fields?.status?.name,
          label: issue?.fields?.status?.name,
        },
      ]}
      placeholder={issue?.fields?.status?.name}
      style={{ maxWidth: "40%" }}
      disabled
    />
  )

  const IssueDetailCard: ReactJSXElement = (
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
              {epicLink}
              {reporter}
            </Stack>
            <Space h="xs" />
          </Collapse>
        </Stack>
      </Card.Section>
    </Card>
  )

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
          {issueStatus}
          {IssueDetailCard}
          {created}
          {updated}
        </Stack>
      </Flex>
    </Modal>
  )
}
