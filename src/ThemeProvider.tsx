import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"
import { ReactElement } from "react"
import { theme } from "../theme"

export function ThemeProvider({ children }: { children: ReactElement }) {
  // withGlobalStyles
  // withNormalizeCSS

  return (
    <MantineProvider theme={theme}>
      <Notifications />
      {children}
    </MantineProvider>
  )
}
