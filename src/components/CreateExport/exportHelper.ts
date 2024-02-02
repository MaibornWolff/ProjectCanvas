import { ipcRenderer } from "electron";
import { showNotification } from "@mantine/notifications";
import dayjs, { Dayjs } from "dayjs";
import dayjsBusinessDays from "dayjs-business-days2";
import { ChangelogHistoryItem, Issue } from "../../../types";
import { ExportReply, ExportStatus } from "../../../electron/export-issues";

dayjs.extend(dayjsBusinessDays);

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
    .toReversed()
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

  // Determines if the time of the endDate is after the time of the startDate manually as there is no dayjs API for this
  // In the case the start time is before the end time, we need to add one working day to accommodate for the start day
  const currentDayIncluded = endDate.hour() > startDate.hour() || (endDate.hour() === startDate.hour()
    && (endDate.minute() > startDate.minute() || (endDate.minute() === startDate.minute()
      && (endDate.second() > startDate.second() || (endDate.second() === startDate.second()
        && endDate.millisecond() > startDate.millisecond())))));

  return {
    ...issue,
    startDate,
    endDate,
    workingDays: currentDayIncluded ? endDate.businessDiff(startDate) : endDate.businessDiff(startDate) + 1,
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
