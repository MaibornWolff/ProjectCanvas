import {
  Accordion,
  Box,
  Breadcrumbs,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { Attachment, Issue, User } from "types"
import {useQueryClient} from "@tanstack/react-query";
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
  const queryClient = useQueryClient()
  const reloadEpics = () => queryClient.invalidateQueries({ queryKey: ["epics"] });

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
        <Group align="flex-start">
          <Stack
              sx={{ flex: 13 }}
              justify="flex-start">
            <Title
                size="h1"
                sx={{ marginBottom: "-10px" }}
            >
              <IssueSummary summary={summary} issueKey={issueKey} onMutate={reloadEpics} />
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
                        <Labels labels={labels} issueKey={issueKey} onMutate={reloadEpics} />
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