import { BrowserWindow } from "electron";

export function handleOAuth2(win: BrowserWindow) {
  const authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  });
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  // join scopes with space (in url encoding)
  const SCOPE = [
    "read:me",
    "read:jira-user",
    "manage:jira-configuration",
    "read:account",
    "manage:jira-project",
    "read:jira-work",
    "write:jira-work",
    "manage:jira-webhook",
    "manage:jira-data-provider",
    "read:sprint:jira-software",
    "read:issue-details:jira",
    "read:board-scope:jira-software",
    "write:sprint:jira-software",
    "write:board-scope:jira-software",
    "read:issue:jira-software",
    "write:issue:jira-software",
    "read:issue-meta:jira",
    "read:avatar:jira",
    "read:field-configuration:jira",
    "read:epic:jira-software",
    "write:epic:jira-software",
    "read:jql:jira",
    "offline_access",
    "offline_access",
  ].join("%20");
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const AUDIENCE = "api.atlassian.com";

  const authUrl = `https://auth.atlassian.com/authorize?audience=${AUDIENCE}&client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=consent`;

  authWindow.loadURL(authUrl);
  authWindow.show();

  authWindow.webContents.on("will-redirect", (_, url) => {
    if (url.startsWith(REDIRECT_URI)) {
      if (
        // handle cancel button press event on the authWindow
        url.includes(
          "error=access_denied&error_description=User%20did%20not%20authorize%20the%20request",
        )
      ) {
        authWindow.destroy();
        win.webContents.send("cancelOAuth");
      } else {
        const code = handleCallback(url, authWindow);
        // Send OAuth code back to renderer process
        win.webContents.send("code", code);
      }
    }
  });
}

function handleCallback(url: string, authWindow: BrowserWindow) {
  const rawCode = /\?code=(.+)/.exec(url) || null;
  const code = rawCode && rawCode.length > 1 ? rawCode[1] : null;
  const error = /\?error=(.+)\$/.exec(url);

  if (code || error) {
    authWindow.destroy();
  }

  if (code) {
    return code;
  }

  return error;
}
