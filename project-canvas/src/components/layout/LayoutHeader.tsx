import {
  ActionIcon,
  Box,
  Group,
  Header,
  useMantineColorScheme,
} from "@mantine/core"
import { IconSun, IconMoonStars } from "@tabler/icons"

export function LayoutHeader() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  return (
    <Header height={60} p="xs">
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
        <Group position="apart">
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
        </Group>
      </Box>
    </Header>
  )
}
