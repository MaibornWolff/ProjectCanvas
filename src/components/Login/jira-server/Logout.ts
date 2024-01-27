import { showNotification } from "@mantine/notifications";

export function Logout({
  LogoutSuccess,
  LogoutFailed,
}: {
  LogoutSuccess: () => void,
  LogoutFailed: () => void,
}) {
  window.provider
    .logout()
    .then(() => LogoutSuccess())
    .catch((error) => {
      showNotification({
        title: error.name,
        message: error.message,
        color: "red",
      });
      LogoutFailed();
    });
}
