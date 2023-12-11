import {
  Accordion,
  Badge,
  Box,
  Breadcrumbs,
  Group,
  HoverCard,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { Issue, User } from "types"
import { useQueryClient } from "@tanstack/react-query"
import { AssigneeMenu } from "../DetailView/Components/AssigneeMenu"
import { Description } from "../DetailView/Components/Description"
import { IssueSummary } from "./Components/IssueSummary"
import { Labels } from "../DetailView/Components/Labels"
import { ReporterMenu } from "../DetailView/Components/ReporterMenu"
import { DeleteIssue } from "../DetailView/Components/DeleteIssue"
import { ColorSchemeToggle } from "../common/ColorSchemeToggle"
import { IssueIcon } from "../BacklogView/Issue/IssueIcon"

export function EpicDetailView({
  issueKey,
  summary,
  labels,
  assignee,
  description,
  created,
  updated,
  closeModal,
}: {
  issueKey: string
  summary: string
  labels: string[]
  assignee?: User
  description: string
  created: string
  updated: string
  closeModal: () => void
}) {
  const queryClient = useQueryClient()
  const reloadEpics = () =>
    queryClient.invalidateQueries({ queryKey: ["epics"] })

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  })

  // Hardcoded Progressbar
  const tasksDone = 3
  const tasksOpen = 1
  const tasksInProgress = 6

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
      <Group align="flex-start">
        <Stack sx={{ flex: 13 }} justify="flex-start">
          <Title size="h1" sx={{ marginBottom: "-10px" }}>
            <IssueSummary
              summary={summary}
              issueKey={issueKey}
              onMutate={reloadEpics}
            />
          </Title>
          <ScrollArea.Autosize
            maxHeight="70vh"
            mr="xs"
            sx={{ minWidth: "260px" }}
          >
            <Text color="dimmed" mb="sm" size="md" sx={{ marginLeft: "7px" }}>
              Description
            </Text>
            <Group
              sx={{
                marginLeft: "10px",
                marginTop: "-7px",
                marginBottom: "20px",
              }}
            >
              <Description issueKey={issueKey} description={description} />
            </Group>
            {/* Add Progressbar here */}
            <Group align="center">
              <Progress
                radius="md"
                size={25}
                styles={{
                  label: {
                    color: "black",
                    fontSize: "14px",
                    fontWeight: "normal",
                  },
                }}
                sx={{
                  width: "400px",
                  marginRight: "5px",
                  marginBottom: "20px",
                }}
                sections={[
                  {
                    value:
                      (tasksDone / (tasksDone + tasksOpen + tasksInProgress)) *
                      100,
                    color: "#10df10",
                    label: `${tasksDone}`,
                    tooltip: `${tasksDone} Done`,
                  },
                  {
                    value:
                      (tasksInProgress /
                        (tasksDone + tasksOpen + tasksInProgress)) *
                      100,
                    color: "#6ba5d8",
                    label: `${tasksInProgress}`,
                    tooltip: `${tasksInProgress} In progress`,
                  },
                  {
                    value:
                      (tasksOpen / (tasksDone + tasksOpen + tasksInProgress)) *
                      100,
                    color: "rgb(225,223,223)",
                    label: `${tasksOpen}`,
                    tooltip: `${tasksOpen} ToDo`,
                  },
                ]}
              />
              <HoverCard width="relative" shadow="md" radius="md">
                <HoverCard.Target>
                  <Badge
                    px="10px"
                    color="gray.6"
                    variant="filled"
                    size="xl"
                    sx={{
                      marginBottom: "20px",
                    }}
                  >
                    <Text size="xs">6</Text>
                  </Badge>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text
                    size="sm"
                    sx={{
                      marginLeft: "-5px",
                    }}
                  >
                    Total story points for <b>Open</b> issues: <b>6</b>
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              <HoverCard width="relative" shadow="md" radius="md">
                <HoverCard.Target>
                  <Badge
                    px="10px"
                    color="blue.8"
                    variant="filled"
                    size="xl"
                    sx={{
                      marginBottom: "20px",
                    }}
                  >
                    <Text size="xs">31</Text>
                  </Badge>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text
                    size="sm"
                    sx={{
                      marginLeft: "-5px",
                    }}
                  >
                    Total story points for <b>In progress</b> issues: <b>31</b>
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
              <HoverCard width="relative" shadow="md" radius="md">
                <HoverCard.Target>
                  <Badge
                    px="10px"
                    color="green.9"
                    variant="filled"
                    size="xl"
                    sx={{
                      marginBottom: "20px",
                    }}
                  >
                    <Text size="xs">11</Text>
                  </Badge>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text
                    size="sm"
                    sx={{
                      marginLeft: "-5px",
                    }}
                  >
                    Total story points for <b>Done</b> issues: <b>11</b>
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Group>
          </ScrollArea.Autosize>
        </Stack>
        <ScrollArea.Autosize
          maxHeight="70vh"
          sx={{ minWidth: "260px", flex: 10 }}
        >
          <Box>
            <Group position="right" mb="sm">
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
                      <Labels
                        labels={labels}
                        issueKey={issueKey}
                        onMutate={reloadEpics}
                      />
                    </Group>
                    <ReporterMenu issueKey={issueKey} />
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
            <Text size="xs" color="dimmed">
              Created {dateFormat.format(new Date(created))}
            </Text>
            <Text size="xs" color="dimmed">
              Updated {dateFormat.format(new Date(updated))}
            </Text>
          </Box>
        </ScrollArea.Autosize>
      </Group>
    </Paper>
  )
}
