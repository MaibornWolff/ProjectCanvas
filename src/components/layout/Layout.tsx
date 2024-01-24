import { AppShell } from "@mantine/core"
import { Outlet } from "react-router-dom"
import { LayoutHeader } from "./LayoutHeader"
import { useColorScheme } from "../../common/color-scheme"

export function Layout() {
  const colorScheme = useColorScheme()

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      styles={(theme) => ({
        main: {
          backgroundColor:
            colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <AppShell.Header>
        <LayoutHeader />
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
