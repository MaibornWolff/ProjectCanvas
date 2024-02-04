import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Stack, Group, Text, Button, Tooltip, CloseButton } from "@mantine/core";
import { sortBy } from "lodash";
import { useQuery } from "@tanstack/react-query";

import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useCanvasStore } from "../../lib/Store";
import { Issue } from "../../../types";
import { addExportedTimeProperties, ExportableIssue, exportIssues } from "./exportHelper";
import { getIssuesByProject } from "../BacklogView/helpers/queryFetchers";
import { StatusType } from "../../../types/status";
import { CheckboxStack } from "./CheckboxStack";
import { InfoButton } from "./InfoButton";

export function CreateExportModal({
  opened,
  setOpened,
}: {
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
}) {
  const {
    selectedProject: project,
    issueStatusByCategory,
    issueTypes,
    issueStatus,
  } = useCanvasStore();
  const boardId = useCanvasStore((state) => state.selectedProjectBoardIds)[0];
  const doneIssueStatus = issueStatus.filter((status) => issueStatusByCategory[StatusType.DONE]?.includes(status));

  const { data: issues } = useQuery<unknown, unknown, Issue[]>({
    queryKey: ["issues", project?.key],
    queryFn: () => project && getIssuesByProject(project.key, boardId),
    enabled: !!project?.key,
    initialData: [],
  });

  const [includedIssueTypes, setIncludedIssueTypes] = useState<string[]>([]);
  const [includedIssueStatus, setIncludedIssueStatus] = useState<string[]>([]);
  const [issuesToExport, setIssuesToExport] = useState<ExportableIssue[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [exportHovered, setExportHovered] = useState(false);
  function calculateIssuesToExport() {
    if (!startDate || !endDate) {
      setIssuesToExport([]);
    }

    const inProgressStatusNames = issueStatus
      .filter((status) => status.statusCategory.name === StatusType.IN_PROGRESS)
      .map((status) => status.name);
    const doneStatusNames = issueStatus
      .filter((status) => status.statusCategory.name === StatusType.DONE)
      .map((status) => status.name);

    setIssuesToExport(
      sortBy(
        issues
          .filter((issue) => includedIssueTypes.includes(issue.type))
          .filter((issue) => includedIssueStatus.includes(issue.status))
          .map((issue) => addExportedTimeProperties(issue, inProgressStatusNames, doneStatusNames))
          .filter((issue) => issue !== undefined)
          .filter((issue) => dayjs(startDate).isBefore(issue!.startDate))
          .filter((issue) => dayjs(endDate).isAfter(issue!.endDate)) as ExportableIssue[],
        ["issueKey"],
      ),
    );
  }

  function closeModal() {
    setIncludedIssueTypes([]);
    setIncludedIssueStatus([]);
    setOpened(false);
  }

  useEffect(() => {
    calculateIssuesToExport();
  }, [includedIssueTypes, includedIssueStatus, startDate, endDate]);

  return (
    <Modal
      opened={opened}
      onClose={() => {
        closeModal();
        setStartDate(null);
        setEndDate(null);
      }}
      centered
      withCloseButton={false}
      size="60vw"
    >
      <Stack
        align="left"
        gap={0}
        style={{
          minHeight: "100%",
          minWidth: "100%",
        }}
      >
        <Group c="dimmed" mb="xs">
          <Text>Issue Export</Text>
          <CloseButton ml="auto" onClick={() => closeModal()} />
        </Group>
        <Group align="top" justify="center" mb="5%">
          <Stack align="center" ml="1%">
            <Group>
              <Text size="md" fw={450} mt="9%" mb="10%">
                Include Issue Types
              </Text>
            </Group>
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
          <Stack align="center" ml="4%">
            <Group>
              <Text size="md" fw={450} mt="10%" mb="10%">
                Include Issue Status
              </Text>
            </Group>
            {doneIssueStatus && (
              <CheckboxStack
                data={doneIssueStatus.map((status) => ({
                  value: status.name,
                  label: status.name,
                }))}
                onChange={(includedStatus) => setIncludedIssueStatus(includedStatus)}
              />
            )}
          </Stack>
          <Stack align="center" w="40%">
            <Group>
              <Text size="md" mt="7%" mb="1%" fw={450}>
                In progress date range
              </Text>
              <InfoButton text="Only issues whose in-progress time is completely inside this date range are exported." mb="0%" mt="xs" />
            </Group>
            <DateInput
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              allowDeselect={false}
              {...(endDate && { maxDate: endDate })}
            />
            <DateInput
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              allowDeselect={false}
              {...(startDate && { minDate: startDate })}
            />
          </Stack>
        </Group>
        <Group>
          <Text size="90%" c="dimmed">
            Issues to export:
            {" "}
            {issuesToExport.length}
          </Text>
          <Tooltip
            withArrow
            multiline
            w={200}
            fz={14}
            fw={500}
            openDelay={200}
            closeDelay={200}
            opened={issuesToExport.length === 0 && exportHovered}
            ta="center"
            color="primaryBlue"
            variant="filled"
            label="No issues are exportable with this configuration"
          >
            <Button
              ml="auto"
              size="sm"
              disabled={issuesToExport.length === 0}
              onMouseOver={() => setExportHovered(true)}
              onMouseOut={() => setExportHovered(false)}
              onClick={() => exportIssues(issuesToExport)}
            >
              Export
            </Button>
          </Tooltip>
        </Group>
      </Stack>
    </Modal>
  );
}
