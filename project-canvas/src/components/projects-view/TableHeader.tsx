import {
  createStyles,
  UnstyledButton,
  Group,
  Center,
  Text,
} from "@mantine/core"
import {
  TablerIcon,
  IconChevronUp,
  IconChevronDown,
  IconSelector,
} from "@tabler/icons"

const useStyles = createStyles((theme) => ({
  tableheader: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}))

export function TableHeader({
  children,
  reversed,
  sorted,
  onSort,
}: {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}) {
  const { classes } = useStyles()
  let Icon: TablerIcon
  if (sorted) {
    if (reversed) Icon = IconChevronUp
    else Icon = IconChevronDown
  } else Icon = IconSelector
  return (
    <th className={classes.tableheader}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={14} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  )
}
