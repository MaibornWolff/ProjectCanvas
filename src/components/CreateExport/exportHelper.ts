import {ipcRenderer} from "electron";
import {Issue} from "../../../types";

export const exportIssues = (issues : Issue[]) => {
  let data = "";
  issues.forEach(
    (issue) => {
      data = data.concat(`${issue.issueKey},${issue.summary},${issue.startDate}\n`) // TODO more fields
    });
  ipcRenderer.send("exportIssues", data)
  ipcRenderer.on("exportIssuesReply", (event, message) => {console.log(message)}) // TODO maybe popup? (returns "cancelled" or "an error occurred" or "success"
}

