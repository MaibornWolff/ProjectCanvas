import { Dispatch, SetStateAction, useEffect,  useState } from "react"
import {
    Modal,
    Stack,
    Group,
    Text, Button, Checkbox, Tooltip, Paper, MantineProvider, createTheme, Box
} from "@mantine/core"
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

    const projectName = useCanvasStore((state) => state.selectedProject?.name);
    const theme = createTheme({
        cursorType:'pointer'
    });
    const [includedIssueTypes, setIncludedIssueTypes] = useState<string[]>([]);
    const [includedIssueStatus, setIncludedIssueStatus] = useState<string[]>([]);
    const [issuesToExport, setIssuesToExport] = useState<Issue[]>([]);
    const [selectAllpressed , setSelectAll] = useState(false);


    // TODO maybe refactor into helper class

    function setIssueTypearray(type : string) {
      const index = includedIssueTypes.indexOf(type);
      if(index < 0) {
        setIncludedIssueTypes(prevTypes => [...prevTypes, type]);
      } else {
          setIncludedIssueTypes(prevTypes => prevTypes.filter(type => type !== type));
      }
    }

    function setIssueStatusarray(status : string){
      const index = includedIssueStatus.indexOf(status);
      if(index < 0) {
        setIncludedIssueStatus(prevStatus => [...prevStatus, status]);
      } else {
        setIncludedIssueStatus(prevStatus => prevStatus.filter(status => status !== status));
      }
    }
    function calculateIssuesToExport() {
        setIssuesToExport(issues
            .filter((element) => includedIssueTypes.includes(element.type))
            .filter((element) => includedIssueStatus.includes(element.status)));
    }

    useEffect(() => {
        calculateIssuesToExport();
    }, [includedIssueTypes, includedIssueStatus, selectAllpressed]);



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
                      checked = {selectAllpressed ||includedIssueTypes.includes('Story')}
                      onChange={() => {
                          if(!selectAllpressed) {
                            setIssueTypearray('Story');
                          }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Task"
                      checked = {selectAllpressed || includedIssueTypes.includes('Task')}
                      onChange={() => {
                        if(!selectAllpressed) {
                          setIssueTypearray("Task");
                        }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Bug"
                      checked = {selectAllpressed || includedIssueTypes.includes('Bug')}
                      onChange={() => {
                        if(!selectAllpressed) {
                          setIssueTypearray("Bug");
                        }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Epic"
                      checked = {selectAllpressed || includedIssueTypes.includes('Epic')}
                      align = "top"
                      onChange={() => {
                        if(!selectAllpressed) {
                          setIssueTypearray("Epic");
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
                      checked= {selectAllpressed || includedIssueStatus.includes('To Do')}
                      onChange={() => {
                        if(!selectAllpressed) {
                          setIssueStatusarray("To Do");
                        }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="In Progress"
                      checked= {selectAllpressed ||includedIssueStatus.includes('In Progress')}
                      onChange={() => {
                        if(!selectAllpressed) {
                          setIssueStatusarray("In Progress");
                        }
                      }}
                    />
                    <Checkbox
                      c="dimmed"
                      label="Done"
                      checked= {selectAllpressed ||includedIssueStatus.includes('Done')}
                      onChange={() => {
                        if(!selectAllpressed) {
                          setIssueStatusarray("Done");
                        }
                      }}
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
                      onChange={() => {
                       if(!selectAllpressed) {
                          setIncludedIssueTypes(['Story', 'Epic', 'Task', 'Bug']);
                          setIncludedIssueStatus(['To Do', 'In Progress', 'Done']);
                          setSelectAll(true);
                        }
                        else {
                          setIncludedIssueStatus([]);
                          setIncludedIssueTypes([]);
                          setSelectAll(false);
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
