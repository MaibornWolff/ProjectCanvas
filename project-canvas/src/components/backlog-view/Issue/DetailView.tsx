import {
  Accordion,
  Box,
  Breadcrumbs,
  Button,
  Group,
  Menu,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IconBinaryTree2, IconCaretDown } from "@tabler/icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { useState } from "react"
import { AssigneeMenu } from "./AssigneeMenu"
import {
  editIssue,
  getIssueTypes,
  setStatus,
} from "../../CreateIssue/queryFunctions"
import { Description } from "./Description"
import { IssueIcon } from "./IssueIcon"
import { ReporterMenu } from "./ReporterMenu"
import { StoryPointsEstMenu } from "./StoryPointsEstMenu"
import { Labels } from "./Labels"
import { CommentSection } from "./CommentSection"

export function DetailView({
  issueKey,
  summary,
  status,
  storyPointsEstimate,
  epic,
  labels,
  assignee,
  description,
  sprintId,
  subtasks,
  created,
  updated,
  comment,
  type,
  projectId,
}: Issue) {
  const [defaultdescription, setdefaultdescription] = useState(description)
  const [showInputEle, setShowInputEle] = useState(false)

  const { data: issueTypes } = useQuery({
    queryKey: ["issueTypes", projectId],
    queryFn: () => getIssueTypes(projectId),
    enabled: !!projectId,
  })
  const queryClient = useQueryClient()

  const [defaultStatus, setDefaultStatus] = useState(status)
  const mutation = useMutation({
    mutationFn: (targetStatus: string) => setStatus(issueKey, targetStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
    },
  })
  const [defaultlabels, setdefaultlabels] = useState(labels)
  const [showLabelsInput, setshowLabelsInput] = useState(false)

  const mutationLalbels = useMutation({
    mutationFn: (issue: Issue) => editIssue(issue, issueKey),
    onError: () => {
      showNotification({
        message: `error occured while modifing the Labels 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      showNotification({
        message: `Labels for issue ${issueKey} has been modified!`,
        color: "green",
      })
    },
  })
  return (
    <Paper p="xs">
      <Breadcrumbs mb="20px">
        {epic !== undefined ? (
          <Group>
            <IssueIcon type="Epic" />
            {epic}
          </Group>
        ) : (
          <Text tt="uppercase">Add Epic</Text>
        )}
        <Group>
          <IssueIcon type={type} /> {issueKey}
        </Group>
      </Breadcrumbs>
      <Group>
        <Stack sx={{ flex: 13 }}>
          <Title order={1}>{summary}</Title>
          <ScrollArea.Autosize
            maxHeight="70vh"
            p="xs"
            sx={{ minWidth: "260px" }}
          >
            <Text color="dimmed" mb="sm">
              Description
            </Text>
            <Description
              showInputEle={showInputEle}
              handleChange={(e) => setdefaultdescription(e.target.value)}
              handleBlur={() => setShowInputEle(false)}
              handleDoubleClick={() => setShowInputEle(true)}
              value={defaultdescription}
            />

            <Text color="dimmed" mb="sm">
              Child Issues
            </Text>
            {subtasks.length !== 0 ? (
              <Paper mb={30} withBorder>
                <Stack spacing="xs">
                  {subtasks.map((subtask) => (
                    <Paper
                      withBorder
                      key={subtask.id}
                      p={5}
                      sx={(theme) => ({
                        display: "flex",
                        gap: theme.spacing.md,
                      })}
                    >
                      <ThemeIcon size="sm" mt={2}>
                        <IconBinaryTree2 />
                      </ThemeIcon>
                      <Text size="md" w="90%">
                        <Text size="sm" color="blue" span mr="md">
                          {subtask.key}
                        </Text>
                        {subtask.fields.summary}{" "}
                      </Text>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            ) : (
              <Text color="dimmed" mb="xl" fs="italic">
                Add child Issue
              </Text>
            )}
            <CommentSection issueKey={issueKey} comment={comment} />
          </ScrollArea.Autosize>
        </Stack>
        <ScrollArea.Autosize
          maxHeight="70vh"
          p="xs"
          sx={{ minWidth: "260px", flex: 11 }}
        >
          <Box p={10}>
            <Menu shadow="md" width={150} position="bottom-start">
              <Menu.Target>
                <Button
                  w={150}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexDirection: "row",
                  }}
                  mb="md"
                >
                  {defaultStatus}
                  <ThemeIcon bg="transparent" ml="50px">
                    <IconCaretDown />
                  </ThemeIcon>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                {issueTypes &&
                  issueTypes
                    .find((issueType) => issueType.name === type)
                    ?.statuses?.map((issueStatus) => (
                      <Menu.Item
                        onClick={() => {
                          mutation.mutate(issueStatus.name)
                          setDefaultStatus(issueStatus.name)
                        }}
                      >
                        {issueStatus.name}
                      </Menu.Item>
                    ))}
              </Menu.Dropdown>
            </Menu>
            <Accordion variant="contained" defaultValue="Details" mb={20}>
              <Accordion.Item value="Details">
                <Accordion.Control sx={{ textAlign: "left" }}>
                  Details
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    {assignee ? (
                      <AssigneeMenu
                        assignee={assignee as Issue["assignee"]}
                        issueKey={issueKey}
                      />
                    ) : (
                      <Group grow>
                        <Text color="dimmed">None</Text>
                      </Group>
                    )}
                    <Group grow>
                      <Text color="dimmed">Labels</Text>
                      <Labels
                        setLabels={setdefaultlabels}
                        showLabelsInput={showLabelsInput}
                        handleBlur={() => {
                          setshowLabelsInput(false)
                          mutationLalbels.mutate({
                            labels: defaultlabels,
                          } as Issue)
                        }}
                        handleDoubleClick={() => setshowLabelsInput(true)}
                        labels={defaultlabels}
                      />
                    </Group>
                    <Group grow>
                      <Text color="dimmed">Sprint</Text>
                      {sprintId ? (
                        <Text>{sprintId}</Text>
                      ) : (
                        <Text color="dimmed">None</Text>
                      )}
                    </Group>
                    <StoryPointsEstMenu
                      issueKey={issueKey}
                      storyPointsEstimate={storyPointsEstimate}
                    />
                    <ReporterMenu issueKey={issueKey} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Text size="xs" color="dimmed">
              Created at{" "}
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(new Date(created))}
            </Text>
            <Text size="xs" color="dimmed">
              Updated at{" "}
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
