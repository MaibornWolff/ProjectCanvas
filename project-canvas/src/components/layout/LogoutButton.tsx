import { Button } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router-dom"
import { Logout } from "../login/jira-server/Logout"

export function LogoutButton() {
  const navigate = useNavigate()
  const LogoutSuccess = () => navigate("/")
  const LogoutFailed = () => {
    showNotification({
      title: "Failed to Logout",
      message: "The use is not authenticated. Please restart the application.",
      color: "red",
    })
  }
  return (
    <Button
      color="red"
      variant="outline"
      onClick={() => {
        Logout({ LogoutSuccess, LogoutFailed })
      }}
    >
      Log out
    </Button>
  )
}
