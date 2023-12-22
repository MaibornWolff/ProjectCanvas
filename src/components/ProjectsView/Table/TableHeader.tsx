import {
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
import { ReactNode } from "react"

import classes from './TableHeader.module.css'

export function TableHeader({
  children,
  reversed,
  sorted,
  onSort,
}: {
  children: ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}) {
  let Icon: TablerIcon
  if (sorted) {
    if (reversed) Icon = IconChevronUp
    else Icon = IconChevronDown
  } else Icon = IconSelector
  return (
    <th className={classes.tableHeader}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="apart">
          <Text size="sm" style={{ fontWeight: 500 }}>
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
