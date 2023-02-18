import {
  Accordion,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Grid,
  Group,
  Menu,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core"
import { IconBinaryTree2, IconCaretDown } from "@tabler/icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Issue } from "project-extender"
import { useState } from "react"
import { AssigneeMenu } from "./AssigneeMenu"
import { getIssueTypes, setStatus } from "../../CreateIssue/queryFunctions"
import { Description } from "./Description"
import { IssueIcon } from "./IssueIcon"
import { ReporterMenu } from "./ReporterMenu"
import { Labels } from "./Labels"
import { IssueSprint } from "./IssueSprint"

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

  return (
    <Paper p={10}>
      <Breadcrumbs mb="50px">
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
      <Grid>
        <ScrollArea.Autosize
          className="right-panel"
          maxHeight="70vh"
          w="60%"
          p="sm"
          sx={{ minWidth: "260px" }}
        >
          <Title order={2} mb={30}>
            {summary}
          </Title>
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
                    sx={(theme) => ({ display: "flex", gap: theme.spacing.md })}
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
          <Stack mb={10}>
            <Text color="dimmed">Comments</Text>
            {comment.comments.map((commentBody) => (
              <Paper
                radius="lg"
                shadow="sm"
                withBorder
                sx={{ minHeight: "10px" }}
              >
                <Stack key={commentBody.id} p={10}>
                  <Group>
                    <Avatar
                      src={commentBody.author.avatarUrls["48x48"]}
                      radius="xl"
                    />
                    <Stack spacing="xs">
                      <Group>
                        <Text fw={600} color="dimmed" mt={20}>
                          {commentBody.author.displayName}
                        </Text>
                        <Text color="dimmed" mt={20} size="xs">
                          {new Intl.DateTimeFormat("en-GB", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(commentBody.created))}
                        </Text>
                      </Group>
                      <Text> {commentBody.body}</Text>
                    </Stack>
                  </Group>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </ScrollArea.Autosize>
        <Box w="40%" p={10}>
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
                  <AssigneeMenu
                    assignee={assignee as Issue["assignee"]}
                    issueKey={issueKey}
                  />

                  <Group grow>
                    <Text color="dimmed">Labels</Text>
                    <Labels labels={labels} issueKey={issueKey} />
                  </Group>
                  <Group grow>
                    <Text color="dimmed">Sprint</Text>
                    <IssueSprint sprint={sprint} issueKey={issueKey} />
                  </Group>
                  <Group grow>
                    <Text color="dimmed">Story Points Estimate</Text>
                    {storyPointsEstimate ? (
                      <Text>{storyPointsEstimate}</Text>
                    ) : (
                      <Text color="dimmed">None</Text>
                    )}
                  </Group>
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
      </Grid>
    </Paper>
  )
}
