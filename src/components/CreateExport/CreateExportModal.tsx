import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {
    Modal,
    Stack,
    Group,
    Text, Button, Checkbox, Tooltip, Paper, MantineProvider, createTheme, Box
} from "@mantine/core"
import {useCanvasStore} from "../../lib/Store";
import {Issue} from "../../../types";
import {exportIssues} from "./exportHelper";

// TODO adapt call to function so that parameter issues contains epics
export function CreateExportModal({
  opened,
  setOpened,
  issues,
}: {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
    issues: Issue[]
}) {

    const projectName = useCanvasStore((state) => state.selectedProject?.name);
    const theme = createTheme({
        cursorType:'pointer'
    });
    const [includedIssueTypes, setIncludedIssueTypes] = useState<string[]>([]);
    const [includedIssueStatus, setIncludedIssueStatus] = useState<string[]>([]);
    const [issuesToExport, setIssuesToExport] = useState<Issue[]>([]);

    // TODO maybe refactor into helper class
    function calculateIssuesToExport() {
        setIssuesToExport(issues
            .filter((element) => includedIssueTypes.includes(element.type))
            .filter((element) => includedIssueStatus.includes(element.status)));
    }

    useEffect(() => {
        calculateIssuesToExport();
    }, [includedIssueTypes, includedIssueStatus]);

    return (
        <Modal
          opened={opened}
          onClose={() => {
              setIncludedIssueTypes([]);
              setIncludedIssueStatus([]);
              setIssuesToExport([]);
              setOpened(false);
          }}
          centered
          withCloseButton={false}
        >
          <Stack
            align="left"
            gap={0}
            style={{
              minHeight: "100%",
              minWidth: "100%",
            }}>
            <Group c="dimmed" mb="5%">
              <Text>{projectName}</Text>
                <Tooltip
                    withArrow
                    multiline
                    w={150}
                    fz={14}
                    fw={500}
                    openDelay={200}
                    closeDelay={200}
                    ta="center"
                    color="#00B0D7"
                    label="Only issues with corresponding  types and status are exported.">
                  <Box
                     w={22}
                     h={22}
                     fz={16}
                     fw={900}
                     ff="BlinkMacSystemFont"
                     ta="center"
                     ml="auto"
                     bg="#00B0D7"
                     c="white"
                     style={{borderRadius: "44px"}}
                  >
                    i
                  </Box>
                </Tooltip>
            </Group>
            <Paper shadow="md" radius="md" withBorder mb="5%">
            <Group align ="top" justify="center" mb="5%">
              <Stack align="center" mr="5%">
                <Text size="md" fw={450} mt="7%" mb="10%" >Include Issue Types</Text>
                  <Stack mt="-12%">
                  <MantineProvider theme={theme}>
                      {/* TODO maybe implement with CheckboxWrapper for generic use */}
                    <Checkbox
                      c="dimmed"
                      label="Story"
                      onChange={() => {
                          const index = includedIssueTypes.indexOf("Story");
                          if(index < 0) {
                              setIncludedIssueTypes(prevTypes => [...prevTypes, "Story"]);
                          } else {
                              setIncludedIssueTypes(prevTypes => prevTypes.filter(type => type !== "Story"));
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Task"
                      onChange={() => {
                          const index = includedIssueTypes.indexOf("Task");
                          if(index < 0) {
                              setIncludedIssueTypes(prevTypes => [...prevTypes, "Task"]);
                          } else {
                              setIncludedIssueTypes(prevTypes => prevTypes.filter(type => type !== "Task"));
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Bug"
                      onChange={() => {
                          const index = includedIssueTypes.indexOf("Bug");
                          if(index < 0) {
                              setIncludedIssueTypes(prevTypes => [...prevTypes, "Bug"]);
                          } else {
                              setIncludedIssueTypes(prevTypes => prevTypes.filter(type => type !== "Bug"));
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Epic"
                      onChange={() => {
                          const index = includedIssueTypes.indexOf("Epic");
                          if(index < 0) {
                              setIncludedIssueTypes(prevTypes => [...prevTypes, "Epic"]);
                          } else {
                              setIncludedIssueTypes(prevTypes => prevTypes.filter(type => type !== "Epic"));
                          }
                      }}
                    />
                  </MantineProvider>
                  </Stack>
              </Stack>
              <Stack align="center">
                <Text size="md" fw={450} mt="7%" mb="10%">Include Issue Status</Text>
                  <Stack mt="-12%">
                  <MantineProvider theme={theme}>
                    <Checkbox
                      c="dimmed"
                      label="To Do"
                      onChange={() => {
                          const index = includedIssueStatus.indexOf("To Do");
                          if(index < 0) {
                            setIncludedIssueStatus(prevStatus => [...prevStatus, "To Do"]);
                          } else {
                            setIncludedIssueStatus(prevStatus => prevStatus.filter(status => status !== "To Do"));
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="In Progress"
                      onChange={() => {
                          const index = includedIssueStatus.indexOf("In Progress");
                          if(index < 0) {
                            setIncludedIssueStatus(prevStatus => [...prevStatus, "In Progress"]);
                          } else {
                            setIncludedIssueStatus(prevStatus => prevStatus.filter(status => status !== "In Progress"));
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Done"
                      onChange={() => {
                          const index = includedIssueStatus.indexOf("Done");
                          if(index < 0) {
                              setIncludedIssueStatus(prevStatus => [...prevStatus, "Done"]);
                          } else {
                              setIncludedIssueStatus(prevStatus => prevStatus.filter(status => status !== "Done"));
                          }
                      }}
                    />
                  </MantineProvider>
                  </Stack>
              </Stack>
            </Group>
            </Paper>
            <Group>
              <Text size="90%" c="dimmed">
                Issues to export: {issuesToExport.length}
              </Text>
                <Button
                  ml="auto"
                  size="sm"
                  onClick={() => { exportIssues(issuesToExport) }}
                >
                  Export CSV
                </Button>
            </Group>
          </Stack>
        </Modal>
    )
}