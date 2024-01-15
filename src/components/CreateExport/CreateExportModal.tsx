import { Dispatch, SetStateAction, useEffect,  useState } from "react"
import {
    Modal,
    Stack,
    Group,
    Text, Button, Checkbox, Tooltip, Paper, MantineProvider, createTheme, Box
} from "@mantine/core"
import {isEqual} from "lodash";
import {useCanvasStore} from "../../lib/Store";
import {Issue} from "../../../types";
import {exportIssues} from "./exportHelper";

export function CreateExportModal({
  opened,
  setOpened,
  issues,
}: {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
    issues: Issue[]
}) {
    const allIssueTypes = ['Story', 'Epic', 'Task', 'Bug'];
    const allStatus = ['To Do', 'In Progress', 'Done'];

    const projectName = useCanvasStore((state) => state.selectedProject?.name);
    const theme = createTheme({
        cursorType:'pointer'
    });
    const [includedIssueTypes, setIncludedIssueTypes] = useState<string[]>([]);
    const [includedIssueStatus, setIncludedIssueStatus] = useState<string[]>([]);
    const [issuesToExport, setIssuesToExport] = useState<Issue[]>([]);

    const allTypesAndStatusSelected = isEqual(includedIssueTypes, allIssueTypes) && isEqual(includedIssueStatus, allStatus);


    // TODO maybe refactor into helper class

    function setIssueTypeArray(setType : string) {
      const index = includedIssueTypes.indexOf(setType);
      if(index < 0) {
        setIncludedIssueTypes(prevTypes => [...prevTypes, setType]);
      } else {
        setIncludedIssueTypes(prevTypes => prevTypes.filter(type => type !== setType));
      }
    }

    function setIssueStatusArray(setStatus : string){
      const index = includedIssueStatus.indexOf(setStatus);
      if(index < 0) {
        setIncludedIssueStatus(prevStatus => [...prevStatus, setStatus]);
      } else {
        setIncludedIssueStatus(prevStatus => prevStatus.filter(status => status !== setStatus));
      }
    }
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
                      checked={includedIssueTypes.includes('Story')}
                      onChange={() => setIssueTypeArray("Story")}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Task"
                      checked={includedIssueTypes.includes('Task')}
                      onChange={() => setIssueTypeArray("Task")}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Bug"
                      checked={includedIssueTypes.includes('Bug')}
                      onChange={() => setIssueTypeArray("Bug")}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Epic"
                      checked={includedIssueTypes.includes('Epic')}
                      onChange={() => setIssueTypeArray("Epic")}
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
                      checked= {includedIssueStatus.includes('To Do')}
                      onChange={() => setIssueStatusArray("To Do")}
                    />
                    <Checkbox
                      c="dimmed"
                      label="In Progress"
                      checked= {includedIssueStatus.includes('In Progress')}
                      onChange={() => setIssueStatusArray("In Progress")}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Done"
                      checked= {includedIssueStatus.includes('Done')}
                      onChange={() => setIssueStatusArray("Done")}
                    />
                  </MantineProvider>
                  </Stack>
              </Stack>
              <Stack align="center">
                <Stack mt="-12%">
                  <MantineProvider theme={theme}>
                    <Checkbox
                      c="dimmed"
                      label="Select All"
                      checked={allTypesAndStatusSelected}
                      indeterminate={!allTypesAndStatusSelected && (includedIssueStatus.length > 0 || includedIssueTypes.length > 0)}
                      onChange={() => {
                        if (allTypesAndStatusSelected) {
                          setIncludedIssueStatus([]);
                          setIncludedIssueTypes([]);
                        } else {
                          setIncludedIssueTypes(allIssueTypes);
                          setIncludedIssueStatus(allStatus);
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
