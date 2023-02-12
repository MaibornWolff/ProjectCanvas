import {
  Accordion,
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core"
import { IconBinaryTree2 } from "@tabler/icons"
import { Issue } from "project-extender"
import { ReactElement } from "react"

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
  icon,
}: Issue & { icon: ReactElement }) {
  return (
    <Paper p={10}>
      <Group mb={40}>
        <Text>{epic}</Text> / {icon} <Text>{issueKey}</Text>
      </Group>
      <Grid>
        <Box w="60%">
          <Title order={2} mb={30}>
            {summary}
          </Title>
          <Group mb={30}>
            <Text color="dimmed">Description</Text>
            <Text>{description}</Text>
          </Group>

          <Text color="dimmed" mb={10}>
            Child Issues
          </Text>
          {subtasks !== undefined ? (
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
            <Text>Add child Issue</Text>
          )}
          <Stack>
            <Text color="dimmed">Comments</Text>
            {comment.comments.map((commentBody) => (
              <Stack key={commentBody.id}>
                <Group>
                  <Avatar
                    src={commentBody.author.avatarUrls["48x48"]}
                    radius="xl"
                  />
                  <Stack spacing="xs">
                    <Text fw={500} color="dimmed" mt={20}>
                      {commentBody.author.displayName}
                    </Text>
                    <Text> {commentBody.body}</Text>
                  </Stack>
                </Group>
              </Stack>
            ))}
          </Stack>
        </Box>
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
