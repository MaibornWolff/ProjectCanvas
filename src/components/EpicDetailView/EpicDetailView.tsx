import {
  Accordion,
  Box,
  Breadcrumbs,
  Button,
  createStyles,
  Group,
  Menu,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { IconCaretDown } from "@tabler/icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Attachment, Issue, Sprint, User } from "types"
import { useState } from "react"
import { getIssueTypes, setStatus } from "../CreateIssue/queryFunctions"
import { AssigneeMenu } from "../DetailView/Components/AssigneeMenu"
import { CommentSection } from "../DetailView/Components/CommentSection"
import { Description } from "../DetailView/Components/Description"
import { IssueSprint } from "./Components/IssueSprint"
import { IssueSummary } from "./Components/IssueSummary"
import { Labels } from "../DetailView/Components/Labels"
import { ReporterMenu } from "../DetailView/Components/ReporterMenu"
import { Subtask } from "./Components/SubTask"
import { DeleteIssue } from "../DetailView/Components/DeleteIssue"
import { Attachments } from "../DetailView/Components/Attachments/Attachments"
import { ColorSchemeToggle } from "../common/ColorSchemeToggle"
import { IssueIcon } from "../BacklogView/Issue/IssueIcon"

export function EpicDetailView({
  issueKey,
  summary,
  status,
  labels,
  assignee,
  description,
  subtasks,
  created,
  updated,
  comment,
  type,
  projectId,
  sprint,
  attachments,
  closeModal,
}: {
  issueKey: string
  summary: string
  status: string
  labels: string[]
  assignee?: User
  description: string
  subtasks: {
    id: string
    key: string
    fields: {
      summary: string
    }
  }[]
  created: string
  updated: string
  comment: {
    comments: [
      {
        id: string
        author: User
        body: string
        created: string
        updated: string
      }
    ]
  }
  type: string
  projectId: string
  sprint?: Sprint
  attachments: Attachment[]
  closeModal: () => void
}) {
  const useStyles = createStyles(
    (theme, { isOpened }: { isOpened: boolean }) => ({
      icon: {
        transition: "transform 150ms ease",
        transform: isOpened ? "rotate(180deg)" : "rotate(0deg)",
      },
    })
  )
  const [opened, setOpened] = useState(false)
  const { classes } = useStyles({ isOpened: opened })

  const { data: issueTypes } = useQuery({
    queryKey: ["issueTypes", projectId],
    queryFn: () => getIssueTypes(projectId),
    enabled: !!projectId,
  })

  const queryClient = useQueryClient()
  const [defaultStatus, setDefaultStatus] = useState(status)
  const statusMutation = useMutation({
    mutationFn: (targetStatus: string) => setStatus(issueKey, targetStatus),
    onSuccess: () => {
      // TODO invalidate epics instead of issues when available
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <Paper p="xs">
      <Breadcrumbs mb="md">
        <Group>
          <IssueIcon type="Epic" /> {issueKey}
        </Group>
      </Breadcrumbs>
      <ColorSchemeToggle
        size="34px"
        sx={{
          position: "absolute",
          top: 19,
          right: 50,
        }}
      />
      <Group>
        <Stack sx={{ flex: 13 }} justify="flex-start">
          <Title order={1}>
            {/* TODO find own epic summary here */}
            <IssueSummary summary={summary} issueKey={issueKey} />
          </Title>
          <ScrollArea.Autosize
            maxHeight="70vh"
            mr="xs"
            sx={{ minWidth: "260px" }}
          >
            <Text color="dimmed" mb="sm">
              Description
            </Text>
            <Description issueKey={issueKey} description={description} />
            <Text color="dimmed" mb="sm">
              Child Issues
            </Text>
            <Paper mb="lg" mr="sm">
              {/* TODO add empty child issue token */}
              {/* TODO map child issues instead of subtasks */}
              <Stack spacing="xs">
                {subtasks.map((subtask) => (
                  <Subtask
                    key={subtask.key}
                    subtaskKey={subtask.key}
                    id={subtask.id}
                    fields={subtask.fields}
                  />
                ))}
              </Stack>
            </Paper>
          </ScrollArea.Autosize>
        </Stack>
        <ScrollArea.Autosize
          maxHeight="70vh"
          sx={{ minWidth: "260px", flex: 10 }}
        >
          <Box>
            <Group position="apart" mb="sm">
              <Menu
                shadow="md"
                onOpen={() => setOpened(true)}
                onClose={() => setOpened(false)}
              >
                <Menu.Target>
                  <Button
                    rightIcon={<IconCaretDown className={classes.icon} />}
                  >
                    {defaultStatus}
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  {issueTypes &&
                    issueTypes
                      .find((issueType) => issueType.name === type)
                      ?.statuses?.map((issueStatus) => (
                        <Menu.Item
                          key={issueStatus.id}
                          onClick={() => {
                            statusMutation.mutate(issueStatus.name)
                            setDefaultStatus(issueStatus.name)
                          }}
                        >
                          {issueStatus.name}
                        </Menu.Item>
                      ))}
                </Menu.Dropdown>
              </Menu>
              <DeleteIssue issueKey={issueKey} closeModal={closeModal} />
            </Group>
            <Accordion variant="contained" defaultValue="Details" mb={20}>
              <Accordion.Item value="Details">
                <Accordion.Control sx={{ textAlign: "left" }}>
                  Details
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <AssigneeMenu
                      assignee={assignee as Issue["assignee"]}
                      issueKey={issueKey}
                    />
                    <Group grow>
                      <Text fz="sm" color="dimmed">
                        Labels
                      </Text>
                      <Labels labels={labels} issueKey={issueKey} />
                    </Group>
                    <Group grow>
                      <Text fz="sm" color="dimmed">
                        Start date
                      </Text>
                      {/* TODO add start date picker */}
                      <IssueSprint sprint={sprint} issueKey={issueKey} />
                    </Group>
                    <Group grow>
                      <Text fz="sm" color="dimmed">
                        Due date
                      </Text>
                      {/* TODO add due date picker */}
                      <IssueSprint sprint={sprint} issueKey={issueKey} />
                    </Group>
                    <ReporterMenu issueKey={issueKey} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Accordion variant="contained" mb={20}>
              <Accordion.Item value="Comments">
                <Accordion.Control sx={{ textAlign: "left" }}>
                  Comments
                </Accordion.Control>
                <Accordion.Panel>
                  <CommentSection issueKey={issueKey} comment={comment} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Accordion variant="contained" mb={20}>
              <Accordion.Item value="Attachments">
                <Accordion.Control sx={{ textAlign: "left" }}>
                  Attachments
                </Accordion.Control>
                <Accordion.Panel>
                  <Attachments issueKey={issueKey} attachments={attachments} />
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Text size="xs" color="dimmed">
              Created{" "}
              {dateFormat.format(new Date(created))}
            </Text>
            <Text size="xs" color="dimmed">
              Updated{" "}
              {dateFormat.format(new Date(updated))}
            </Text>
          </Box>
        </ScrollArea.Autosize>
      </Group>
    </Paper>
  )
}
