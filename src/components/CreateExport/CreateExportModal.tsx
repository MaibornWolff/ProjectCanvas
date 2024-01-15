import { Dispatch, SetStateAction, useEffect,  useState } from "react"
import {
  Modal,
  Stack,
  Group,
  Text, Button, Checkbox, Tooltip, Paper, MantineProvider, createTheme, ActionIcon
} from "@mantine/core"
import {isEqual} from "lodash";
import {useQuery} from "@tanstack/react-query";
import {IconInfoCircle} from "@tabler/icons-react";
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
    const project = useCanvasStore((state) => state.selectedProject);

    const { data: issueTypes } = useQuery({
      queryKey: ["issueTypes", project?.key],
      queryFn: () => project && window.provider.getIssueTypesByProject(project.key),
      enabled: !!project?.key,
      initialData: [],
    });

    const allIssueTypeNames = issueTypes ? issueTypes.map((issueType) => issueType.name!) : [];
    const allStatus = ['To Do', 'In Progress', 'Done'];

    const theme = createTheme({ cursorType: 'pointer' });
    const [includedIssueTypes, setIncludedIssueTypes] = useState<string[]>([]);
    const [includedIssueStatus, setIncludedIssueStatus] = useState<string[]>([]);
    const [issuesToExport, setIssuesToExport] = useState<Issue[]>([]);

    const allTypesAndStatusSelected = isEqual(includedIssueTypes, allIssueTypeNames) && isEqual(includedIssueStatus, allStatus);

    function toggleInList(list: string[], value: string): string[] {
        const index = list.indexOf(value);
        return index < 0 ? [...list, value] : list.filter(containedValue => containedValue !== value);
    }
    const toggleIssueType = (type : string) => setIncludedIssueTypes(toggleInList(includedIssueTypes, type))
    const toggleIssueStatus = (status : string) => setIncludedIssueStatus(toggleInList(includedIssueStatus, status))

    function calculateIssuesToExport() {
        setIssuesToExport(issues
            .filter((issue) => includedIssueTypes.includes(issue.type))
            .filter((issue) => !includedIssueStatus.includes(issue.status)));
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
              <Text>{project?.name}</Text>
                <Tooltip
                  withArrow
                  multiline
                  w={150}
                  fz={14}
                  fw={500}
                  openDelay={200}
                  closeDelay={200}
                  ta="center"
                  color="primaryBlue"
                  variant="filled"
                  label="Only issues with corresponding types and status are exported"
                >
                  <ActionIcon variant="subtle" ml="auto">
                    <IconInfoCircle />
                  </ActionIcon>
                </Tooltip>
            </Group>
            <Paper shadow="md" radius="md" withBorder mb="5%">
            <Group align ="top" justify="center" mb="5%">
              <Stack align="center" mr="5%">
                <Text size="md" fw={450} mt="7%" mb="10%" >Include Issue Types</Text>
                  <Stack mt="-12%">
                    <MantineProvider theme={theme}>
                      {issueTypes && issueTypes.map((issueType) => (
                        <Checkbox
                          {...(!includedIssueTypes.includes(issueType.name!) && { c: "dimmed" })}
                          key={issueType.id}
                          label={issueType.name}
                          checked={includedIssueTypes.includes(issueType.name!)}
                          onChange={() => toggleIssueType(issueType.name!)}
                        />
                      ))}
                    </MantineProvider>
                  </Stack>
              </Stack>
              <Stack align="center">
                <Text size="md" fw={450} mt="7%" mb="10%">Include Issue Status</Text>
                  <Stack mt="-12%">
                    <MantineProvider theme={theme}>
                      {allStatus && allStatus.map((status) => (
                        <Checkbox
                          {...(!includedIssueStatus.includes(status) && { c: "dimmed" })}
                          key={status}
                          label={status}
                          checked={includedIssueStatus.includes(status)}
                          onChange={() => toggleIssueStatus(status)}
                        />
                      ))}
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
                          setIncludedIssueTypes(allIssueTypeNames);
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
