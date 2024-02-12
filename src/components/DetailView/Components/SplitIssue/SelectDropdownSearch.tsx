import { useState } from "react";
import { ActionIcon, Combobox, Group, InputBase, ScrollArea, useCombobox } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Issue } from "../../../../../types";
import { getIssuesByProject } from "../../../BacklogView/helpers/queryFetchers";
import { useCanvasStore } from "../../../../lib/Store";

export function SelectDropdownSearch({
  onIssueSelected,
  selectedSplitIssues,
}: {
  onIssueSelected: (issueKey: string) => void,
  selectedSplitIssues: string[],
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const { selectedProject: project, selectedProjectBoardIds: boardIds } = useCanvasStore();
  const { data: issues } = useQuery<unknown, unknown, Issue[]>({
    queryKey: ["issues", project?.key],
    queryFn: () => project && getIssuesByProject(project.key, boardIds[0]),
    enabled: !!project?.key,
    initialData: [],
  });

  const [search, setSearch] = useState("");
  const shouldFilterOptions = issues.map((issue) => issue.summary).every((item) => item !== search);
  const filteredIssuesToSelect = issues.filter((issue) => !(selectedSplitIssues.some((splitIssue) => splitIssue.includes(issue.issueKey))));
  const filteredSearchOptions = shouldFilterOptions
    ? filteredIssuesToSelect.filter(
      (issue) => issue.summary.toLowerCase().includes(search.toLowerCase().trim())
        || issue.issueKey.toLowerCase().includes(search.toLowerCase().trim()),
    )
    : filteredIssuesToSelect;

  const options = filteredSearchOptions.map((item) => (
    <Combobox.Option value={item.issueKey} key={item.issueKey}>
      <Group justify="space-between">
        {item.summary}
        <span style={{ color: "#888" }}>{item.issueKey}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={onIssueSelected}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          leftSection={(
            <ActionIcon>
              <IconSearch size={14} />
            </ActionIcon>
          )}
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => { combobox.closeDropdown(); }}
          placeholder="Find issue name or key"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <ScrollArea>
          <Combobox.Options>
            {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
          </Combobox.Options>
        </ScrollArea>
      </Combobox.Dropdown>
    </Combobox>
  );
}
