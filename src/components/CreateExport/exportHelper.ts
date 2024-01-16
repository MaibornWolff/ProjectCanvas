import {ipcRenderer} from "electron";
import {showNotification} from "@mantine/notifications";
import {Issue} from "../../../types";
import {ExportReply, ExportStatus} from "../../../electron/export-issues";

type ExportableIssue = Issue & { startDate: Date, endDate: Date, workingDays: number }

const addExportedTimeProperties = (issue: Issue): ExportableIssue => ({
   ...issue,
    startDate: new Date(),
    endDate: new Date(),
    workingDays: 0,
})


export const exportIssues = (issues: Issue[]) => {
  const header = ["ID", "Name", "Start Date", "End Date", "Working days"]
  const data = [header.map((h) => `"${h}"`).join(",")]

  issues.forEach((issue) => {
    const exportableIssue = addExportedTimeProperties(issue);
    const exportedValues = [
      `"${exportableIssue.issueKey}"`,
      `"${exportableIssue.summary}"`,
      `"${exportableIssue.startDate?.toISOString()}"`,
      `"${exportableIssue.endDate?.toISOString()}"`,
      exportableIssue.workingDays,
    ]

    data.push(exportedValues.join(','))
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

