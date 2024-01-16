import {ipcRenderer} from "electron";
import {NotificationData, showNotification} from "@mantine/notifications";
import {Issue} from "../../../types";

export const exportIssues = (issues : Issue[]) => {
  let data = "ID,Name,Start Date\n";
  issues.forEach(
    (issue) => {
      data = data.concat(`${issue.issueKey},${issue.summary},${issue.startDate}\n`) // TODO more fields
    });
  ipcRenderer.send("exportIssues", data);
  ipcRenderer.once(
    "exportIssuesReply",
    (_, notification: NotificationData) => { showNotification(notification) });
}

