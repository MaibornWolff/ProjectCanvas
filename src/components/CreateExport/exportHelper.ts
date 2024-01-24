import { ipcRenderer } from "electron";
import { showNotification } from "@mantine/notifications";
import dayjs, { Dayjs } from "dayjs";
import { ChangelogHistoryItem, Issue, IssueStatus } from "../../../types";
import { ExportReply, ExportStatus } from "../../../electron/export-issues";
import { StatusType } from "../../../types/status";

type ExportableIssue = Omit<Issue, "startDate"> & {
  startDate?: Dayjs;
  endDate?: Dayjs;
  workingDays: number;
};

const addExportedTimeProperties = (
  issue: Issue,
  inProgressStatusNames: string[],
): ExportableIssue => {
  const statusItems = issue.changelog.histories
    .reverse()
    .map((history) => {
      const statusItem = history.items.find((item) => item.field === "status");

      return statusItem
        ? {
          ...statusItem,
          date: dayjs(history.created),
        }
        : undefined;
    })
    .filter((i) => i) as (ChangelogHistoryItem & { date: Dayjs })[];

  const enterEdges = statusItems.filter(
    (item) => item.toString
      && inProgressStatusNames.includes(item.toString)
      && item.fromString
      && !inProgressStatusNames.includes(item.fromString),
  );
  const leaveEdges = statusItems.filter(
    (item) => item.fromString
      && inProgressStatusNames.includes(item.fromString)
      && item.toString
      && !inProgressStatusNames.includes(item.toString),
  );
  if (enterEdges.length !== leaveEdges.length) {
    throw new Error(
      `Inconsistent in-progress changelog history encountered. Enter edge count: ${enterEdges.length}. Leave edge count: ${leaveEdges.length}`,
    );
  }

  if (enterEdges.length === 0) {
    return {
      ...issue,
      startDate: undefined,
      endDate: undefined,
      workingDays: 0,
    };
  }

  let workingDays = 0;
  for (let i = 0; i < enterEdges.length; i += 1) {
    const enterDate = dayjs(enterEdges[i].date);
    const leaveDate = dayjs(leaveEdges[i].date);

    workingDays += Math.ceil(leaveDate.diff(enterDate, "day", true));
  }

  return {
    ...issue,
    startDate: dayjs(enterEdges[0].date),
    endDate: dayjs(leaveEdges[leaveEdges.length - 1].date),
    workingDays,
  };
};

export const exportIssues = (
  issues: Issue[],
  includedStatus: IssueStatus[],
) => {
  const header = ["ID", "Name", "Start Date", "End Date", "Working days"];
  const data = [header.map((h) => `"${h}"`).join(",")];

  const inProgressStatusNames = includedStatus
    .filter((status) => status.statusCategory.name === StatusType.IN_PROGRESS)
    .map((status) => status.name);

  issues.forEach((issue) => {
    const exportableIssue = addExportedTimeProperties(
      issue,
      inProgressStatusNames,
    );
    const exportedValues = [
      `"${exportableIssue.issueKey}"`,
      `"${exportableIssue.summary}"`,
      `${
        exportableIssue.startDate
          ? `"${exportableIssue.startDate?.toISOString()}"`
          : ""
      }`,
      `${
        exportableIssue.endDate
          ? `"${exportableIssue.endDate?.toISOString()}"`
          : ""
      }`,
      exportableIssue.workingDays,
    ];

    data.push(exportedValues.join(","));
  });

  ipcRenderer.send("exportIssues", data.join("\n"));
  ipcRenderer.once("exportIssuesReply", (_, reply: ExportReply) => {
    let message;
    let color;
    switch (reply.status) {
      case ExportStatus.ERROR:
        message = reply.error;
        color = "red";
        break;
      case ExportStatus.CANCELED:
        message = "Canceled saving file";
        color = "red";
        break;
      case ExportStatus.SUCCESS:
        message = "File saving success";
        color = "green";
        break;
      default:
        message = "Unknown";
        color = "gray";
    }

    showNotification({ message, color });
  });
};
