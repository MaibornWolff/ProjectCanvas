import {
  Dispatch, SetStateAction, useEffect, useState,
} from "react";
import {
  Modal,
  Stack,
  Group,
  Text,
  Button,
  Tooltip,
  Paper,
  ActionIcon,
} from "@mantine/core";
import { sortBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { IconInfoCircle } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
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
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    selectedProject: project,
    issueStatusByCategory,
    issueTypes,
    issueStatus,
  } = useCanvasStore();
  const boardId = useCanvasStore((state) => state.selectedProjectBoardIds)[0];

  const { data: issues } = useQuery<unknown, unknown, Issue[]>({
    queryKey: ["issues", project?.key],
    queryFn: () => project && getIssuesByProject(project.key, boardId),
    enabled: !!project?.key,
    initialData: [],
  });

  const doneStatusNames = issueStatusByCategory[StatusType.DONE]?.map((s) => s.name) ?? [];

  const [includedIssueTypes, setIncludedIssueTypes] = useState<string[]>([]);
  const [includedIssueStatus, setIncludedIssueStatus] = useState<string[]>([]);
  const [issuesToExport, setIssuesToExport] = useState<Issue[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  function calculateIssuesToExport() {
    setIssuesToExport(
      sortBy(
        issues
          .filter((issue) => includedIssueTypes.includes(issue.type))
          .filter(
            (issue) => includedIssueStatus.includes(issue.status)
              && doneStatusNames.includes(issue.status),
          )
          .filter(
            (issue) => !startDate || dayjs(startDate).isBefore(dayjs(issue.created)),
          )
          .filter(
            (issue) => !endDate || dayjs(endDate).isAfter(dayjs(issue.created)),
          ),
        ["issueKey"],
      ),
    );
  }

  useEffect(() => {
    calculateIssuesToExport();
  }, [includedIssueTypes, includedIssueStatus, startDate, endDate]);

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
        <Paper shadow="md" radius="md" withBorder mb="xs">
          <Group align="top" justify="center" mb="5%">
            <Stack align="center" mr="5%">
              <Text size="md" fw={450} mt="7%" mb="10%">
                Include Issue Types
              </Text>
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
              <Text size="md" fw={450} mt="7%" mb="10%">
                Include Issue Status
              </Text>
              {issueStatus && (
                <CheckboxStack
                  data={issueStatus.map((status) => ({
                    value: status.name,
                    label: status.name,
                  }))}
                  onChange={(includedStatus) => setIncludedIssueStatus(includedStatus)}
                />
              )}
            </Stack>
            <Stack align="center" mt="xs" w="40%">
              <Text size="md" fw={450}>
                Creation date range
              </Text>
              <DateInput
                label="Start Date"
                clearable
                value={startDate}
                onChange={setStartDate}
                {...(endDate && { maxDate: endDate })}
              />
              <DateInput
                label="End Date"
                clearable
                value={endDate}
                onChange={setEndDate}
                {...(startDate && { minDate: startDate })}
              />
            </Stack>
          </Group>
        </Paper>
        <Group>
          <Text size="90%" c="dimmed">
            Issues to export:
            {" "}
            {issuesToExport.length}
          </Text>
          <Button
            ml="auto"
            size="sm"
            onClick={() => {
              exportIssues(
                issuesToExport,
                issueStatus.filter((s) => includedIssueStatus.includes(s.name)),
              );
            }}
          >
            Export CSV
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
