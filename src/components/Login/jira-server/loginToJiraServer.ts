import { showNotification } from "@mantine/notifications";
import { BasicAuthLoginOptions } from "@canvas/electron/providers/base-provider";
import { ProviderType } from "@canvas/electron/provider/setup";

export async function loginToJiraServer({
  onSuccess,
  loginOptions,
}: {
  onSuccess: () => void,
  loginOptions: BasicAuthLoginOptions,
}) {
  window.provider
    .login({
      provider: ProviderType.JiraServer,
      basicAuthLoginOptions: {
        ...loginOptions,
        url: ensureProtocol(loginOptions.url),
      },
    })
    .then(() => onSuccess())
    .catch((error) => {
      showNotification({
        title: error.name,
        message: error.message,
        color: "red",
      });
    });
}

function ensureProtocol(url: string) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    return `https://${url}`;
  }
  return url;
}
