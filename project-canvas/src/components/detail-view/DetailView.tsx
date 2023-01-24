import { useEffect, useState } from "react"
import {
  Modal,
  Button,
  Group,
  Avatar,
  Flex,
  Badge,
  List,
  Collapse,
} from "@mantine/core"
import {
  IssueBean,
  IssueTypeDetails,
} from "project-extender/src/providers/jira-cloud-provider/types"
import { useParams } from "react-router-dom"
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace"
import { RichTextEditor } from "@mantine/rte"
import { CardView } from "./CardView"

export function DetailView() {
  const avatarImageSize: { text: string; size: number } = {
    text: "32x32",
    size: 32,
  }

  const { keyOrId } = useParams<string>()
  const [opened, setOpened] = useState(true)
  const [openedSubtasks, setopenedSubtasks] = useState(true)
  const [issue, setIssue] = useState<IssueBean>({})

  useEffect(() => {
    fetch(`${import.meta.env.VITE_EXTENDER}/issue/${keyOrId}`)
      .then((response) => response.json())
      .then((data) => {
        setIssue(data)
        // console.log(data)
      })

    /* TODO: Load Comments

    fetch(`${import.meta.env.VITE_EXTENDER}/issue/${keyOrId}/comments`)
      .then((response) => response.json())
      .then((comments) => {
        console.log(comments)
      }) */
  }, [])

  const title: ReactJSXElement = (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Avatar
        src={issue?.fields?.parent?.fields?.issuetype?.iconUrl}
        size={avatarImageSize.size}
        alt="ParentIssueTypeIcon"
      />
      <h4>{issue?.fields ? `${issue?.fields?.parent?.key} /` : ""}</h4>
      <Avatar
        src={issue?.fields?.issuetype?.iconUrl}
        size={avatarImageSize.size}
        alt="IssueTypeIcon"
      />
      <h4>{issue?.key ? issue.key : ""}</h4>
    </Flex>
  )

  // TODO: Mantine RichTextEditor isn't able to handle embedded images
  const description: ReactJSXElement = (
    <RichTextEditor readOnly value={`${issue?.renderedFields?.description}`} />
  )

  const labels: ReactJSXElement = (
    <Flex
      gap="xs"
      justify="flex-start"
      align="flex-start"
      direction="row"
      wrap="wrap"
    >
      {issue?.fields?.labels?.map((label: string) => (
        <Badge key={label} color="indigo" variant="light">
          {label}
        </Badge>
      ))}
    </Flex>
  )

  const created: ReactJSXElement = <p>{`${issue?.renderedFields?.created}`}</p>

  const updated: ReactJSXElement = <p>{`${issue?.renderedFields?.updated}`}</p>

  const summary: ReactJSXElement = <p>{`${issue?.fields?.summary}`}</p>

  const assignee: ReactJSXElement = (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Avatar
        src={issue?.fields?.assignee?.avatarUrls[avatarImageSize.text]}
        size={avatarImageSize.size}
        alt="IssueAssigneeIcon"
      />
      <p>{issue?.fields?.assignee?.displayName}</p>
    </Flex>
  )

  const reporter: ReactJSXElement = (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Avatar
        src={issue?.fields?.reporter?.avatarUrls[avatarImageSize.text]}
        size={avatarImageSize.size}
        alt="IssueAssigneeIcon"
      />
      <p>{issue?.fields?.reporter?.displayName}</p>
    </Flex>
  )

  const priority: ReactJSXElement = (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Avatar
        src={issue?.fields?.priority?.iconUrl}
        size={avatarImageSize.size}
        alt="IssuePriorityIcon"
      />
      <p>{issue?.fields?.priority?.name}</p>
    </Flex>
  )

  const subtasks: ReactJSXElement = (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Button onClick={() => setopenedSubtasks((o) => !o)} fullWidth>
        Subtasks
      </Button>
      <Collapse in={openedSubtasks}>
        <List spacing="xs" size="sm" center>
          {issue?.fields?.subtasks?.map((task: IssueBean) => (
            <List.Item
              key={task?.key}
              icon={
                <Avatar
                  src={(task?.fields?.issuetype as IssueTypeDetails).iconUrl}
                  size={avatarImageSize.size}
                  alt="IssueSubstaskIcon"
                />
              }
            >
              <p>{task?.fields?.summary}</p>
            </List.Item>
          ))}
        </List>
      </Collapse>
    </Flex>
  )

  /*   const comments: ReactJSXElement = (
    <Flex
      gap="xs"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="wrap"
    >
      <Button onClick={() => setopenedSubtasks((o) => !o)} fullWidth>
        Comments
      </Button>
      <Collapse in={openedSubtasks}>
        {         <List spacing="xs" size="sm" center>
          {issue?.fields?.comment?.comments.map((task: IssueBean) => (
            <List.Item
              icon={
                <Avatar
                  src={(task?.fields?.issuetype as IssueTypeDetails).iconUrl}
                  size={avatarImageSize.size}
                  alt="IssueSubstaskIcon"
                />
              }
            >
              <p>{task?.fields?.summary}</p>
            </List.Item>
          ))}
        </List> }
      </Collapse>
    </Flex>
  )
 */
  return (
    <>
      <Modal
        size="80%"
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
        overflow="inside"
      >
        <Group noWrap align="flex-start" mt="xs" grow>
          <div>
            <div>
              <h5>Summary</h5>
              {summary}
            </div>

            <div>
              <h5>Description</h5>
              {description}
            </div>

            <h5>Estimate</h5>

            <div>
              <h5>Prority</h5>
              {priority}
            </div>

            <h5>Component</h5>

            <div>
              <h5>Labels</h5>
              {labels}
            </div>

            <h5>Affected versions</h5>

            <h5>Fix versions</h5>

            <h5>Epic link</h5>

            <div>
              <h5>Reporter</h5>
              {reporter}
            </div>

            <div>
              <h5>Assignee</h5>
              {assignee}
            </div>

            <div>
              <h5>Date created</h5>
              {created}
            </div>

            <div>
              <h5>Date updated</h5>
              {updated}
            </div>

            <h5>Issue links</h5>

            <h5>Comments</h5>

            <h5>Attachments</h5>

            <div>{subtasks}</div>

            {/* fields && <ul>{fields}</ul> */}
          </div>

          <div>
            <CardView />
          </div>
        </Group>
      </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>
    </>
  )
}
