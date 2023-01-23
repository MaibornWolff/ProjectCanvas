import { Box, Button, Group, Header, Menu, Image } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useNavigate } from "react-router-dom"
import { ColorSchemeToggle } from "../common/ColorSchemeToggle"
import { Logout } from "../login/jira-server/Logout"

export function LayoutHeader() {
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
    <Header
      height="60"
      p="sm"
      sx={(theme) => ({
        borderBottom: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      })}
    >
      <Box
        sx={(theme) => ({
          paddingLeft: theme.spacing.xs,
          paddingRight: theme.spacing.xs,
        })}
      >
        <Group spacing="xl">
          <Image
            src="/project_canvas_logo_sm.svg"
            height={36}
            width={36}
            fit="contain"
          />
          <Menu width={200} shadow="md">
            <Menu.Target>
              <Button>Projects</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                component="a"
                onClick={() => navigate("/projectsview")}
              >
                Projects View
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <ColorSchemeToggle size="34px" ml="auto" />

          <Button
            color="secondary"
            variant="outline"
            onClick={() => {
              Logout({ LogoutSuccess, LogoutFailed })
            }}
          >
            Log out
          </Button>
        </Group>
      </Box>
    </Header>
  )
}
