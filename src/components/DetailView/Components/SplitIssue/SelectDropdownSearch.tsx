import { Dispatch, SetStateAction, useState } from "react";
import { ActionIcon, Combobox, InputBase, useCombobox } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

export function SelectDropdownSearch({
  issueNames,
  splitViewModalOpened,
}: {
  issueNames: string[],
  splitViewModalOpened: Dispatch<SetStateAction<boolean>>,
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const shouldFilterOptions = issueNames.every((item) => item !== search);
  const filteredOptions = shouldFilterOptions
    ? issueNames.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))
    : issueNames;

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        setSearch(val);
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
            setSearch(value || "");
          }}
          placeholder="Search value"

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
