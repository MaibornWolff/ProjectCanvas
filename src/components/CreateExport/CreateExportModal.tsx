import {Dispatch, SetStateAction, useState} from "react";
import {
    Modal,
    Stack,
    Group,
    Text, Button, Checkbox, Tooltip, Paper, MantineProvider, createTheme
} from "@mantine/core"
import {IconInfoCircle} from "@tabler/icons-react";
import {useCanvasStore} from "../../lib/Store";
import {Issue} from "../../../types";

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
    const text = "Only issues with corresponding \n types and status are exported.";
    const theme = createTheme({
        cursorType:'pointer'
    });
    const includedIssueTypes: string[] = [];
    const includedIssueStatus: string[] = [];
    const [issuesToExport, setIssuesToExport] = useState<Issue[]>([]);

    return (
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
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
                <Tooltip label={text}>
                  <IconInfoCircle
                      size={24}
                      color="blue"
                      style={{marginLeft: "auto"}}
                    />
                </Tooltip>
            </Group>
            <Paper shadow="md" radius="md" withBorder mb="5%" color="lightblue">
            <Group align ="top" justify="center" mb="5%">
              <Stack align="center" mr="5%">
                <Text size="md" fw={450} mt="7%" mb="10%" >Include Issue Types</Text>
                  <Stack mt="-12%">
                  <MantineProvider theme={theme}>
                      {/* TODO maybe implement with CheckboxWrapper for generic use */}
                    <Checkbox
                      c="dimmed"
                      label="Story"
                      onChange={(event) => {
                          const index = includedIssueTypes.indexOf("Story");
                          if(index < 0) {
                              includedIssueTypes.push("Story");
                          } else {
                              includedIssueTypes.splice(index, 1);
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Task"
                      onChange={(event) => {
                          const index = includedIssueTypes.indexOf("Task");
                          if(index < 0) {
                              includedIssueTypes.push("Task")
                          } else {
                              includedIssueTypes.splice(index, 1);
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Bug"
                      onChange={(event) => {
                          const index = includedIssueTypes.indexOf("Bug");
                          if(index < 0) {
                              includedIssueTypes.push("Bug")
                          } else {
                              includedIssueTypes.splice(index, 1);
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Epic"
                      onChange={(event) => {
                          const index = includedIssueTypes.indexOf("Epic");
                          if(index < 0) {
                              includedIssueTypes.push("Epic")
                          } else {
                              includedIssueTypes.splice(index, 1);
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
                      onChange={(event) => {
                          const index = includedIssueStatus.indexOf("To Do");
                          if(index < 0) {
                              includedIssueStatus.push("To Do")
                          } else {
                              includedIssueStatus.splice(index, 1);
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="In Progress"
                      onChange={(event) => {
                          const index = includedIssueStatus.indexOf("In Progress");
                          if(index < 0) {
                              includedIssueStatus.push("In Progress")
                          } else {
                              includedIssueStatus.splice(index, 1);
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Done"
                      onChange={(event) => {
                          const index = includedIssueStatus.indexOf("Done");
                          if(index < 0) {
                              includedIssueStatus.push("Done")
                          } else {
                              includedIssueStatus.splice(index, 1);
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
                  onClick={(event) => {
                      // TODO implement export as csv
                  }}
                >
                    Export CSV
                </Button>
            </Group>
          </Stack>
        </Modal>
    )
}