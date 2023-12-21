import { ScrollArea, Table, Text, TextInput } from "@mantine/core"
import { IconSearch } from "@tabler/icons"
import { Project } from "types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCanvasStore } from "../../../lib/Store"
import { TableHeader } from "./TableHeader"
import { sortData } from "./TableHelper"

export function ProjectsTable({ data }: { data: Project[] }) {
  const [search, setSearch] = useState("")
  const [sortedData, setSortedData] = useState(data)
  const [sortBy, setSortBy] = useState<keyof Project | null>(null)
  const [reverseSortDirection, setReverseSortDirection] = useState(false)
  const { setSelectedProject, setSelectedProjectBoardIds } = useCanvasStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize sortedData with the sorted and filtered data
    //  when the component is first rendered
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search })
    )
  }, [data, sortBy, reverseSortDirection, search])

  const setSorting = (field: keyof Project) => {
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

  const onClickRow = async (row: Project) => {
    setSelectedProject(row)
    setSelectedProjectBoardIds(await window.provider.getBoardIds(row.key))
    navigate("/backlogview")
  }

  const rows = sortedData.map((row) => (
    <tr
      style={{ cursor: "pointer" }}
      key={row.key}
      onClick={() => onClickRow(row)}
    >
      {Object.keys(row).map((key) => (
        <td key={key}> {row[key as keyof Project]}</td>
      ))}
    </tr>
  ))

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch size={14} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        highlightOnHover
        horizontalSpacing="md"
        verticalSpacing="xs"
        style={{ tableLayout: "fixed", minWidth: 700 }}
      >
        <thead>
          <tr>
            {data && data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <TableHeader
                  key={key}
                  sorted={sortBy === key}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting(key as keyof Project)}
                >
                  {key.toLocaleUpperCase()}
                </TableHeader>
              ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data).length}>
                <Text style={{ fontWeight: 500, align: "center" }}>
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
