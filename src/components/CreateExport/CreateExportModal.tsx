import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Modal, Stack, Group, Text, Button, Tooltip, Paper, ActionIcon } from "@mantine/core"
import { uniqWith, sortBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { IconInfoCircle } from "@tabler/icons-react";
import { useCanvasStore } from "../../lib/Store";
import { Issue } from "../../../types";
import { exportIssues } from "./exportHelper";
import { getIssuesByProject } from "../BacklogView/helpers/queryFetchers";
import { StatusType } from "../../../types/status";
import { CheckboxStack } from "./CheckboxStack";

export function CreateExportModal({
    opened,
    setOpened,
}: {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}) {
    const project = useCanvasStore((state) => state.selectedProject);
    const boardId = useCanvasStore((state) => state.selectedProjectBoardIds)[0]

    const { data: issues } = useQuery<unknown, unknown, Issue[]>({
      queryKey: ["issues", project?.key],
      queryFn: () => project && getIssuesByProject(project.key, boardId),
      enabled: !!project?.key,
      initialData: [],
    });

    const { data: issueTypes } = useQuery({
      queryKey: ["issueTypes", project?.key],
      queryFn: () => project && window.provider.getIssueTypesByProject(project.key),
      enabled: !!project?.key,
      initialData: [],
    });

    const allStatus = sortBy(
      uniqWith(
        issueTypes?.flatMap((issueType) => issueType.statuses ?? []),
        (statusA, statusB) => statusA.id === statusB.id,
      ),
      [
        (status) => Object.values(StatusType).indexOf(status.statusCategory.name as StatusType),
        'name',
      ],
    )

    const allStatusNamesByCategory: { [key: string]: string[] } = {};
    allStatus.forEach((status) => {
        allStatusNamesByCategory[status.statusCategory.name] ??= [];
        allStatusNamesByCategory[status.statusCategory.name].push(status.name);
    });

    const [includedIssueTypes, setIncludedIssueTypes] = useState<string[]>([]);
    const [includedIssueStatus, setIncludedIssueStatus] = useState<string[]>([]);
    const [issuesToExport, setIssuesToExport] = useState<Issue[]>([]);

    function calculateIssuesToExport() {
        setIssuesToExport(
            sortBy(
                issues
                    .filter((issue) => includedIssueTypes.includes(issue.type))
                    .filter((issue) => includedIssueStatus.includes(issue.status)
                        && allStatusNamesByCategory[StatusType.DONE].includes(issue.status)),
                ['issueKey']
            )
        );
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
          size="40vw"
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
                  label="Only issues with corresponding types and a 'Done' status are exported. The remaining status influence the date calculations."
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
                  {issueTypes && (
                    <CheckboxStack
                      data={issueTypes.map((issueType) => ({
                        value: issueType.name!,
                        label: issueType.name!,
                      }))}
                      onChange={(includedTypes) => setIncludedIssueTypes(includedTypes)}
                    />
                  )}
                </Stack>
                <Stack align="center">
                  <Text size="md" fw={450} mt="7%" mb="10%">Include Issue Status</Text>
                  {allStatus && (
                    <CheckboxStack
                      data={allStatus.map((status) => ({
                        value: status.name,
                        label: status.name,
                      }))}
                      onChange={(includedStatus) => setIncludedIssueStatus(includedStatus)}
                    />
                  )}
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
