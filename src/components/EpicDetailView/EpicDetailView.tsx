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
import { Issue, User } from "types"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "@mantine/notifications";
import { AssigneeMenu } from "../DetailView/Components/AssigneeMenu"
import { Description } from "../DetailView/Components/Description"
import { InlineDatePicker } from "./Components/InlineDatePicker"
import { IssueSummary } from "./Components/IssueSummary"
import { Labels } from "../DetailView/Components/Labels"
import { ReporterMenu } from "../DetailView/Components/ReporterMenu"
import { DeleteIssue } from "../DetailView/Components/DeleteIssue"
import { ColorSchemeToggle } from "../common/ColorSchemeToggle"
import { IssueIcon } from "../BacklogView/Issue/IssueIcon"
import { editIssue } from "./helpers/queryFunctions";

export function EpicDetailView({
   issueKey,
   summary,
   labels,
   assignee,
   description,
   created,
   updated,
   closeModal,
   startDate,
   dueDate,
 }: {
  issueKey: string
  summary: string
  labels: string[]
  assignee?: User
  description: string
  created: string
  updated: string
  closeModal: () => void
  startDate: Date
  dueDate: Date
}) {
  const queryClient = useQueryClient()
  const reloadEpics = () => queryClient.invalidateQueries({ queryKey: ["epics"] });

  const useDateMutation = (property: string) => useMutation({
    mutationFn: (currentDate: Date | undefined) => editIssue({ [property]: currentDate } as unknown as Issue, issueKey),
    onError: () => {
      showNotification({
        message: `An error occurred while modifing the date 😢`,
        color: "red",
      })
    },
    onSuccess: () => {
      showNotification({
        message: `The date for epic ${issueKey} has been modified!`,
        color: "green",
      })
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
                      <Group grow>
                        <Text fz="sm" color="dimmed">
                          Start date
                        </Text>
                        {/* TODO fixme also fix using custom fields */}
                        <InlineDatePicker
                          date={startDate}
                          mutation={useDateMutation('startDate')}
                          placeholder="Pick start date"
                        />
                      </Group>
                      <Group grow>
                        <Text fz="sm" color="dimmed">
                          Due date
                        </Text>
                        <InlineDatePicker
                          date={dueDate}
                          mutation={useDateMutation('dueDate')}
                          placeholder="Pick due date"
                        />
                      </Group>
                      <ReporterMenu issueKey={issueKey} />
                    </Stack>
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