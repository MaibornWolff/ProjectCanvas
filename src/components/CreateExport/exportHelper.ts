import {ipcRenderer} from "electron";
import {Issue} from "../../../types";

export const exportIssues = (issues : Issue[]) => {
  let data = "\"ID\",\"Name\",\"Start Date\"\n";
  issues.forEach(
    (issue) => {
      data = data.concat(`"${issue.issueKey}","${issue.summary}","${issue.startDate}"\n`) // TODO more fields
    });
  ipcRenderer.send("exportIssues", data)
  ipcRenderer.on("exportIssuesReply", (_, message) => {console.log(message)}) // TODO maybe popup? (returns "cancelled" or "an error occurred" or "success"
}

