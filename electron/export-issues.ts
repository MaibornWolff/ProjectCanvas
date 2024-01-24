import fs from "fs"
import * as Electron from "electron"

export const enum ExportStatus {
  SUCCESS = "success",
  CANCELED = "canceled",
  ERROR = "error",
}

export type ExportReply = { status: ExportStatus; error?: string }

export const getExportIssuesHandler =
  (electron: typeof Electron, mainWindow: Electron.BrowserWindow) =>
  (event: Electron.IpcMainEvent, data: string) => {
    electron.dialog
      .showSaveDialog(mainWindow!, {
        title: "Export issues to CSV",
        defaultPath: electron.app.getPath("downloads"),
        filters: [{ name: "CSV file", extensions: ["csv"] }],
        properties: [],
      })
      .then((file) => {
        if (file.canceled) {
          event.reply("exportIssuesReply", { status: ExportStatus.CANCELED })
        } else {
          fs.writeFile(
            file.filePath?.toString() ?? electron.app.getPath("downloads"),
            data,
            (err) => {
              if (err) throw err
            }
          )
          event.reply("exportIssuesReply", { status: ExportStatus.SUCCESS })
        }
      })
      .catch((e) =>
        event.reply("exportIssuesReply", {
          status: ExportStatus.ERROR,
          error: e.toString,
        })
      )
  }
