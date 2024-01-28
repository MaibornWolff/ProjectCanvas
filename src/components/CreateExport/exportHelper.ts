import { ipcRenderer } from "electron";
import { showNotification } from "@mantine/notifications";
import dayjs, { Dayjs } from "dayjs";
import { ChangelogHistoryItem, Issue } from "../../../types";
import { ExportReply, ExportStatus } from "../../../electron/export-issues";

export type ExportableIssue = Omit<Issue, "startDate"> & {
  startDate: Dayjs,
  endDate: Dayjs,
  workingDays: number,
};

export const addExportedTimeProperties = (
  issue: Issue,
  inProgressStatusNames: string[],
  doneStatusNames: string[],
): ExportableIssue | undefined => {
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
      && doneStatusNames.includes(item.toString),
  );

  if (enterEdges.length === 0) {
    return undefined;
  }

  const startDate = dayjs(enterEdges[0].date);
  const endDate = dayjs(leaveEdges[leaveEdges.length - 1].date);

  return {
    ...issue,
    startDate,
    endDate,
    workingDays: Math.ceil(endDate.diff(startDate, "day", true)),
  };
};

export const exportIssues = (issues: ExportableIssue[]) => {
  const header = ["ID", "Name", "Start Date", "End Date", "Working days"];
  const data = [header.map((h) => `"${h}"`).join(",")];

  issues.forEach((issue) => {
    const exportedValues = [
      `"${issue.issueKey}"`,
      `"${issue.summary}"`,
      `"${issue.startDate?.toISOString()}"`,
      `"${issue.endDate?.toISOString()}"`,
      issue.workingDays,
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
