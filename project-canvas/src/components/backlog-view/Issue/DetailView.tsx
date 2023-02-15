import {
  Accordion,
  Avatar,
  Badge,
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
import { IconBinaryTree2 } from "@tabler/icons"
import { Issue } from "project-extender"
import { useState } from "react"
import { Description } from "./Description"
import { IssueIcon } from "./IssueIcon"

export function DetailView({
  issueKey,
  summary,
  status,
  storyPointsEstimate,
  epic,
  labels,
  assignee,
  creator,
  description,
  sprintId,
  subtasks,
  created,
  updated,
  comment,
  type,
}: Issue) {
  const [defaultdescription, setdefaultdescription] = useState(description)
  const [showInputEle, setShowInputEle] = useState(false)

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
        <Box w="40%" p={20}>
          <Menu shadow="md" width={150} position="bottom-start">
            <Menu.Target>
              <Button
                w={150}
                sx={{ display: "flex", justifyContent: "flex-start" }}
                mb={10}
              >
                {status}
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>To Do</Menu.Item>
              <Menu.Item>In Progress</Menu.Item>
              <Menu.Item>Review</Menu.Item>
              <Menu.Item>Done</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Accordion variant="contained" defaultValue="Details" mb={30}>
            <Accordion.Item value="Details">
              <Accordion.Control sx={{ textAlign: "left" }}>
                Details
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  <Group grow>
                    <Text color="dimmed">Assignee</Text>
                    {assignee.displayName ? (
                      <Text>{assignee.displayName}</Text>
                    ) : (
                      <Text color="dimmed">None</Text>
                    )}
                  </Group>
                  <Group grow>
                    <Text color="dimmed">Labels</Text>
                    {labels.length !== 0 ? (
                      <Group>
                        {labels.map((label) => (
                          <Badge>{label}</Badge>
                        ))}
                      </Group>
                    ) : (
                      <Text color="dimmed">None</Text>
                    )}
                  </Group>
                  <Group grow>
                    <Text color="dimmed">Sprint</Text>
                    {sprintId ? (
                      <Text>{sprintId}</Text>
                    ) : (
                      <Text color="dimmed">None</Text>
                    )}
                  </Group>
                  <Group grow>
                    <Text color="dimmed">Story Points Estimate</Text>
                    {storyPointsEstimate ? (
                      <Text>{storyPointsEstimate}</Text>
                    ) : (
                      <Text color="dimmed">None</Text>
                    )}
                  </Group>
                  <Group grow>
                    <Text color="dimmed">Reporter</Text>
                    <Text>{creator}</Text>
                  </Group>
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
