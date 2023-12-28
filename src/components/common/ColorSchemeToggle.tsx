import { ActionIcon, useMantineColorScheme } from "@mantine/core"
import { IconSun, IconMoonStars } from "@tabler/icons-react"

export function ColorSchemeToggle({ ...props }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  return (
    <ActionIcon
      variant="default"
      onClick={() => toggleColorScheme()}
      size={30}
      {...props}
    >
      {colorScheme === "dark" ? (
        <IconSun size={16} />
      ) : (
        <IconMoonStars size={16} />
      )}
    </ActionIcon>
  )
}
