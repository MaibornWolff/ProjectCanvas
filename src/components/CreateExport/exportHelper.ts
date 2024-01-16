import {ipcRenderer} from "electron";
import {showNotification} from "@mantine/notifications";
import {Issue} from "../../../types";
import {ExportReply, ExportStatus} from "../../../electron/export-issues";

export const exportIssues = (issues : Issue[]) => {
  let data = "\"ID\",\"Name\",\"Start Date\"\n";
  issues.forEach(
    (issue) => {
      data = data.concat(`"${issue.issueKey}","${issue.summary}","${issue.startDate}"\n`) // TODO more fields
    });
  ipcRenderer.send("exportIssues", data);
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

