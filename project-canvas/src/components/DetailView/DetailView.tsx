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
import { Issue } from "project-extender"
import { useState } from "react"
import { getIssueTypes, setStatus } from "../CreateIssue/queryFunctions"
import { AddSubtask } from "./Components/AddSubtask"
import { AssigneeMenu } from "./Components/AssigneeMenu"
import { EditableEpic } from "./Components/EditableEpic"
import { CommentSection } from "./Components/CommentSection"
import { Description } from "./Components/Description"
import { IssueIcon } from "../backlog-view/Issue/IssueIcon"
import { IssueSprint } from "./Components/IssueSprint"
import { IssueSummary } from "./Components/IssueSummary"
import { Labels } from "./Components/Labels"
import { ReporterMenu } from "./Components/ReporterMenu"
import { StoryPointsEstimateMenu } from "./Components/StoryPointsEstimateMenu"
import { Subtask } from "./Components/SubTask/Subtask"
import { DeleteIssue } from "./Components/DeleteIssue"
import { Attachments } from "./Components/Attachments/Attachments"

export function DetailView({
  issueKey,
  summary,
  status,
  storyPointsEstimate,
  epic,
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
}: Issue & { closeModal: () => void }) {
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
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })

  return (
    <Paper p="xs">
      <Breadcrumbs mb="md">
        <EditableEpic projectId={projectId} issueKey={issueKey} epic={epic} />

        <Group>
          <IssueIcon type={type} /> {issueKey}
        </Group>
      </Breadcrumbs>
      <Group>
        <Stack sx={{ flex: 13 }}>
          <Title order={1}>
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
              <Stack spacing="xs">
                {subtasks.map((subtask) => (
                  <Subtask
                    key={subtask.key}
                    subtaskKey={subtask.key}
                    id={subtask.id}
                    fields={subtask.fields}
                  />
                ))}
                <AddSubtask issueKey={issueKey} projectId={projectId} />
              </Stack>
            </Paper>
            <Attachments issueKey={issueKey} attachments={attachments} />
            <CommentSection issueKey={issueKey} comment={comment} />
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
                        Sprint
                      </Text>
                      <IssueSprint sprint={sprint} issueKey={issueKey} />
                    </Group>
                    <StoryPointsEstimateMenu
                      issueKey={issueKey}
                      storyPointsEstimate={storyPointsEstimate}
                    />
                    <ReporterMenu issueKey={issueKey} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Text size="xs" color="dimmed">
              Created{" "}
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date(created))}
            </Text>
            <Text size="xs" color="dimmed">
              Updated{" "}
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date(updated))}
            </Text>
          </Box>
        </ScrollArea.Autosize>
      </Group>
    </Paper>
  )
}
