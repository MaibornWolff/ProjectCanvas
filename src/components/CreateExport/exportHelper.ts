import {ipcRenderer} from "electron";
import {showNotification} from "@mantine/notifications";
import {Issue} from "../../../types";
import {ExportReply, ExportStatus} from "../../../electron/export-issues";

export type ExportableIssue = Issue & { startDate: Date, endDate: Date, workingDays: number }

export const exportIssues = (issues: ExportableIssue[]) => {
  const data = ['"ID","Name","Start Date","End Date","Working days"']

  issues.forEach((issue) => {
    data.push(`"${issue.issueKey}","${issue.summary}","${issue.startDate?.toISOString()}","${issue.endDate?.toISOString()}",${issue.workingDays}`)
  });

  ipcRenderer.send("exportIssues", data.join("\n"));
  ipcRenderer.once(
    "exportIssuesReply",
    (_, reply: ExportReply) => {
      let message;
      let color;
      switch (reply.status) {
        case ExportStatus.ERROR:
          message = reply.error
          color = "red"
          break;
        case ExportStatus.CANCELED:
          message = "Canceled saving file"
          color = "red"
          break;
        case ExportStatus.SUCCESS:
          message = "File saving success"
          color = "green"
          break;
        default:
          message = "Unknown"
          color = "gray"
      }

      showNotification({ message, color })
    });
}

