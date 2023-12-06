import {
  Accordion,
  Box,
  Breadcrumbs,
  Group, HoverCard,
  Paper, Progress,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { Attachment, Issue, User } from "types"
import { AssigneeMenu } from "../DetailView/Components/AssigneeMenu"
import { CommentSection } from "../DetailView/Components/CommentSection"
import { Description } from "../DetailView/Components/Description"
import { IssueSummary } from "./Components/IssueSummary"
import { Labels } from "../DetailView/Components/Labels"
import { ReporterMenu } from "../DetailView/Components/ReporterMenu"
import { DeleteIssue } from "../DetailView/Components/DeleteIssue"
import { Attachments } from "../DetailView/Components/Attachments/Attachments"
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
   comment,
   attachments,
   closeModal,
 }: {
  issueKey: string
  summary: string
  labels: string[]
  assignee?: User
  description: string
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
  attachments: Attachment[]
  closeModal: () => void
}) {
  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  // Hardcoded Progressbar
  const tasksDone = 3;
  const tasksOpen = 1;

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
          <Stack
              sx={{ flex: 13 }}
              justify="flex-start">
            <Title
                size="h1"
                sx={{ marginBottom: "-10px" }}
            >
              {/* TODO find own epic summary here */}
              <IssueSummary summary={summary} issueKey={issueKey}/>
            </Title>
            <ScrollArea.Autosize
                maxHeight="70vh"
                mr="xs"
                sx={{ minWidth: "260px" }}
            ><Text color="dimmed" mb="sm" size="md" sx={{ marginLeft: "7px" }}>
              Description
            </Text>
              <Group sx={{marginLeft: "10px", marginTop: "-7px", marginBottom: "20px"}}>
                <Description issueKey={issueKey} description={description} />
              </Group>
              {/* Add Progressbar here */}
              <Group align="center">
                <Progress
                    radius="md"
                    size={25}
                    styles={{
                      label: {
                        color: 'black',
                        fontSize: '14px',
                        fontWeight: 'normal'
                      }
                    }}
                    sx={{
                      width: '400px',
                      marginRight: '5px',
                      marginBottom: '20px'
                    }}
                    sections={[
                      { value: tasksDone / (tasksDone + tasksOpen) * 100, color: '#10df10', label: `${tasksDone}`, tooltip: `${tasksDone} Done`  },
                      { value: tasksOpen / (tasksDone + tasksOpen) * 100, color: 'rgb(225,223,223)', label: `${tasksOpen}`, tooltip: `${tasksOpen} ToDo` },
                    ]}
                />
                <HoverCard width="relative" shadow="md" radius="md">
                  <HoverCard.Target>
                    <Paper
                        withBorder
                        style={{
                          backgroundColor: '#f2f2f0',
                          borderColor: '#6e7363',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          color: 'black',
                          marginBottom: '20px',
                        }}
                    ><Text size="xs">6</Text>
                    </Paper>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm" sx={{
                      marginLeft: '-5px'
                    }}>
                      Total story points for <b>Open</b> issues: <b>6</b>
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
                <HoverCard width="relative" shadow="md" radius="md">
                  <HoverCard.Target>
                    <Paper
                        withBorder
                        style={{
                          backgroundColor: '#dbe3ef',
                          borderColor: '#434fe3',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          color: 'black',
                          marginBottom: '20px'
                        }}
                    ><Text size="xs">31</Text>
                    </Paper>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm" sx={{
                      marginLeft: '-5px'
                    }}>
                      Total story points for <b>In progress</b> issues: <b>31</b>
                    </Text>
                  </HoverCard.Dropdown>
                </HoverCard>
                <HoverCard width="relative" shadow="md" radius="md">
                  <HoverCard.Target>
                    <Paper
                        withBorder
                        style={{
                          backgroundColor: '#D2ECD3',
                          borderColor: '#10df10',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          color: 'black',
                          marginBottom: '20px'
                        }}
                    ><Text size="xs">11</Text>
                    </Paper>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Text size="sm" sx={{
                      marginLeft: '-5px'
                    }}>
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
                        <Labels labels={labels} issueKey={issueKey} />
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