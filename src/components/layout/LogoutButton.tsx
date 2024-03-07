import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const navigate = useNavigate();

  return (
    <Button
      color="primaryRed"
      variant="outline"
      onClick={() => {
        window.provider.logout()
          .then(() => navigate("/"))
          .catch((error) => {
            showNotification({
              title: error.name,
              message: error.message,
              color: "red",
            });
            showNotification({
              title: "Failed to logout",
              message: "The user is not authenticated. Please restart the application.",
              color: "red",
            });
          });
      }}
    >
      Log out
    </Button>
  );
}
