import { Dispatch, SetStateAction, useState } from "react";
import { ActionIcon, Combobox, Group, InputBase, useCombobox } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Issue } from "../../../../../types";

export function SelectDropdownSearch({
  splitViewModalOpened,
  issues,
  setSelectedSplitIssues,
}: {
  splitViewModalOpened: Dispatch<SetStateAction<boolean>>,
  issues : Issue[],
  setSelectedSplitIssues: Dispatch<SetStateAction<string[]>>,
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState("");

  const shouldFilterOptions = issues.map((issue) => issue.summary).every((item) => item !== search);
  const filteredOptions = shouldFilterOptions
    ? issues.filter((issue) => issue.summary.toLowerCase().includes(search.toLowerCase().trim()) || issue.issueKey.toLowerCase().includes(search.toLowerCase().trim()))
    : issues;

  const addSelectedIssue = (newIssue: string) => {
    setSelectedSplitIssues((state) => [...state, newIssue]);
  };

  const options = filteredOptions.map((item) => (
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
      onOptionSubmit={(val) => {
        addSelectedIssue(val);
        splitViewModalOpened(true);
      }}
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
          onBlur={() => {
            combobox.closeDropdown();
          }}
          placeholder="Find issue name or key"

        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
