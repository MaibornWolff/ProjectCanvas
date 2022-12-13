import { useState } from "react"
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
} from "@mantine/core"
import { keys } from "@mantine/utils"
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  TablerIcon,
} from "@tabler/icons"

const useStyles = createStyles((theme) => ({
  th: {
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

interface RowData {
  //   Star: TablerIcon
  Name: string
  Key: string
  Type: string
  Lead: string
}

interface TableSortProps {
  data: RowData[]
}

interface ThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles()
  let Icon: TablerIcon
  if (sorted) {
    if (reversed) Icon = IconChevronUp
    else Icon = IconChevronDown
  } else Icon = IconSelector
  return (
    <th className={classes.th}>
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

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim()
  return data.filter((item) =>
    keys(data[0])
      //   .filter((key) => typeof item[key] === "string")
      .some((key) => item[key].toLowerCase().includes(query))
  )
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload

  if (!sortBy) {
    return filterData(data, payload.search)
  }

  return filterData(
    [...data]
      //   .filter((el) => typeof el[sortBy] === "string")
      .sort((a, b) => {
        if (payload.reversed) {
          return b[sortBy].localeCompare(a[sortBy])
        }

        return a[sortBy].localeCompare(b[sortBy])
      }),
    payload.search
  )
}

export function TableSort({ data }: TableSortProps) {
  const [search, setSearch] = useState("")
  const [sortedData, setSortedData] = useState(data)
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false
    setReverseSortDirection(reversed)
    setSortBy(field)
    setSortedData(sortData(data, { sortBy: field, reversed, search }))
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearch(value)
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value })
    )
  }

  const rows = sortedData.map((row) => (
    <tr key={row.Name}>
      <td>{row.Name}</td>
      <td>{row.Key}</td>
      <td>{row.Type}</td>
      <td>{row.Lead}</td>
    </tr>
  ))

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed", minWidth: 700 }}
      >
        <thead>
          <tr>
            <Th
              sorted={sortBy === "Name"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("Name")}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === "Key"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("Key")}
            >
              Key
            </Th>
            <Th
              sorted={sortBy === "Type"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("Type")}
            >
              Type
            </Th>
            <Th
              sorted={sortBy === "Lead"}
              reversed={reverseSortDirection}
              onSort={() => setSorting("Lead")}
            >
              Lead
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  )
}
