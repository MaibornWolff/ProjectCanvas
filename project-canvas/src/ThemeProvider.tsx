import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import { ReactElement, useState } from "react"
import { theme } from "../theme"

export function ThemeProvider({ children }: { children: ReactElement }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light")
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"))

  return (
    <NotificationsProvider>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ ...theme, colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          {children}
        </MantineProvider>
      </ColorSchemeProvider>
    </NotificationsProvider>
  )
}
