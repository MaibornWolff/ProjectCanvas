import { Anchor, Box, Group, Header, Image } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { ColorSchemeToggle } from "../common/ColorSchemeToggle"
import { LogoutButton } from "./LogoutButton"

export function LayoutHeader() {
  const navigate = useNavigate()
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
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate("/projectsview")}
          >
            Projects
          </Anchor>
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate("/backlogview")}
          >
            Backlog
          </Anchor>
          <ColorSchemeToggle size="34px" ml="auto" />
          <LogoutButton />
        </Group>
      </Box>
    </Header>
  )
}
