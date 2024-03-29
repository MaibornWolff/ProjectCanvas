import { ScrollArea, Table, Text, TextInput, Center, Group, UnstyledButton } from "@mantine/core";
import { Icon, IconChevronDown, IconChevronUp, IconSearch, IconSelector } from "@tabler/icons-react";
import { Project } from "types";
import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCanvasStore } from "@canvas/lib/Store";
import { RouteNames } from "@canvas/route-names";
import { sortData } from "./TableHelper";

import classes from "./ProjectsTable.module.css";

export function ProjectsTable({ data }: { data: Project[] }) {
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof Project | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const { setSelectedProject, setSelectedProjectBoardIds, setIssueTypes, setIssueTypesWithFieldsMap } = useCanvasStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize sortedData with the sorted and filtered data
    //  when the component is first rendered
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search }),
    );
  }, [data, sortBy, reverseSortDirection, search]);

  const setSorting = (field: keyof Project) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(data, { sortBy, reversed: reverseSortDirection, search: value }),
    );
  };

  const onClickRow = async (row: Project) => {
    setSelectedProject(row);
    const [boardIds, issueTypes, issueTypesWithFieldsMap] = await Promise.all([
      window.provider.getBoardIds(row.key),
      window.provider.getIssueTypesByProject(row.key),
      window.provider.getIssueTypesWithFieldsMap()
        .then(async (mapResponse) => {
          const map = new Map<string, string[]>();
          Object.entries(mapResponse).forEach(([key, value]) => map.set(key, value));
          return map;
        }),
    ]);
    setSelectedProjectBoardIds(boardIds);
    setIssueTypes(issueTypes);
    setIssueTypesWithFieldsMap(issueTypesWithFieldsMap);
    navigate(RouteNames.BACKLOG_VIEW);
  };

  const header = data
    && data.length > 0
    && Object.keys(data[0]).filter((key) => key !== "id").map((key) => {
      let SortIcon: Icon;
      if (sortBy === key) {
        if (reverseSortDirection) SortIcon = IconChevronUp;
        else SortIcon = IconChevronDown;
      } else SortIcon = IconSelector;

      return (
        <Table.Th key={key}>
          <UnstyledButton
            onClick={() => setSorting(key as keyof Project)}
            className={classes.headerControl}
          >
            <Group justify="space-between">
              <Text size="sm" style={{ fontWeight: 500 }}>
                {key.toLocaleUpperCase()}
              </Text>
              <Center className={classes.headerSortIcon}>
                <SortIcon size={14} stroke={1.5} />
              </Center>
            </Group>
          </UnstyledButton>
        </Table.Th>
      );
    });

  const rows = sortedData.map((row) => (
    <Table.Tr
      style={{ cursor: "pointer" }}
      key={row.key}
      onClick={() => onClickRow(row)}
    >
      {Object.keys(row).filter((key) => key !== "id").map((key) => (
        <Table.Td key={key}>
          {" "}
          {row[key as keyof Project]}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

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
        <Table.Thead>
          <Table.Tr>{header}</Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={Object.keys(data).length}>
                <Text style={{ fontWeight: 500, align: "center" }}>
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
