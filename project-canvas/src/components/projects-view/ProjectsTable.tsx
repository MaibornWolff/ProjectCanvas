import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { create } from "zustand"
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

export interface ProjectData {
  name: string
  key: string
  type: string
  lead: string
}

interface ProjectsTableProps {
  data: ProjectData[]
}

interface ThProps {
  children: React.ReactNode
  reversed: boolean
  sorted: boolean
  onSort(): void
}
export interface ProjectStore {
  selectedProject: ProjectData | null
  selectedProjectBoards: number[]
  setSelectedProject: (project: ProjectData) => void
  setSelectedProjectBoards: (boards: number[]) => void
}

export const useProjectStore = create<ProjectStore>()((set) => ({
  // initial state is null
  selectedProject: null,
  selectedProjectBoards: [],
  setSelectedProjectBoards: (boards: number[]) =>
    set(() => ({ selectedProjectBoards: boards })),
  setSelectedProject: (row: ProjectData | null) =>
    set(() => ({ selectedProject: row })),
}))

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

function filterData(data: ProjectData[], search: string) {
  const query = search.toLowerCase().trim()
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  )
}

function sortData(
  data: ProjectData[],
  payload: {
    sortBy: keyof ProjectData | null
    reversed: boolean
    search: string
  }
) {
  const { sortBy } = payload

  if (!sortBy) {
    return filterData(data, payload.search)
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy])
      }

      return a[sortBy].localeCompare(b[sortBy])
    }),
    payload.search
  )
}

export function ProjectsTable({ data }: ProjectsTableProps) {
  const [search, setSearch] = useState("")
  const [sortedData, setSortedData] = useState(data)
  const [sortBy, setSortBy] = useState<keyof ProjectData | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const { setSelectedProject, setSelectedProjectBoards } = useProjectStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize sortedData with the sorted and filtered data
    //  when the component is first rendered
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search })
    )
  }, [data, sortBy, reverseSortDirection, search])

  const setSorting = (field: keyof ProjectData) => {
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
  const getBoardIds = async (projectKey: string) => {
    const BoardIdsResponse = await fetch(
      `${import.meta.env.VITE_EXTENDER}/getBoardIds?projectKey=${projectKey}`
    )
    const BoardIds = await BoardIdsResponse.json()
    return BoardIds
  }
  const rowOnClick = async (row: ProjectData) => {
    setSelectedProject(row)
    setSelectedProjectBoards(await getBoardIds(row.key))
    navigate("/backlogview")
  }

  const rows = sortedData.map((row) => (
    <tr key={row.key} onClick={() => rowOnClick(row)}>
      {Object.keys(row).map((key) => (
        <td key={key}> {row[key as keyof ProjectData]}</td>
      ))}
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
        highlightOnHover
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: "fixed", minWidth: 700 }}
      >
        <thead>
          <tr>
            {data &&
              data != null &&
              data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <Th
                  key={key}
                  sorted={sortBy === key}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting(key as keyof ProjectData)}
                >
                  {key.toLocaleUpperCase()}
                </Th>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data).length}>
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
