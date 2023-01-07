import {
  ActionIcon,
  Affix,
  Box,
  Button,
  Group,
  Header,
  Menu,
  useMantineColorScheme,
} from "@mantine/core"
import { IconSun, IconMoonStars, IconExternalLink } from "@tabler/icons"
import { useNavigate } from "react-router-dom"
import { Logout } from "../login/jira-server/Logout"

export function LayoutHeader() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const navigate = useNavigate()

  return (
    <Header height="60" p="sm">
      <Box
        sx={(theme) => ({
          paddingLeft: theme.spacing.xs,
          paddingRight: theme.spacing.xs,
          paddingBottom: theme.spacing.lg,
          borderBottom: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[4]
              : theme.colors.gray[2]
          }`,
        })}
      >
        <Group position="left" spacing="xl">
          <ActionIcon
            variant="default"
            onClick={() => toggleColorScheme()}
            size={30}
          >
            {colorScheme === "dark" ? (
              <IconSun size={16} />
            ) : (
              <IconMoonStars size={16} />
            )}
          </ActionIcon>
          <Affix position={{ top: 20, right: 20 }}>
            <Button
              color="dark"
              onClick={() => {
                Logout()
                navigate("/")
              }}
            >
              Log out
            </Button>
          </Affix>

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

              <Menu.Item
                icon={<IconExternalLink size={14} />}
                component="a"
                href="https://mantine.dev"
                target="_blank"
              >
                External link
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Box>
    </Header>
  )
}
