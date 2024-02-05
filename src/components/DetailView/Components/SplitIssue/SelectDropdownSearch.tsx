import { useState } from "react";
import { PillsInput, Pill, Combobox, CheckIcon, Group, useCombobox, ActionIcon } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { SplitView } from "./SplitView";

export function SelectDropdownSearch({
  issueNames,
}: {
  issueNames: string[],
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string[]>([]);
  const [createSplitViewOpened, setCreateSplitViewOpened] = useState(false);

  // const handleValueSelect = (val: string) => setValue((current) => (current.includes(val) ? current.filter((v) => v !== val) : [...current, val]));

  const handleValueRemove = (val: string) => setValue((current) => current.filter((v) => v !== val));

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const options = issueNames
    .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={value.includes(item)}>
        <Group gap="sm">
          {value.includes(item) ? <CheckIcon size={12} /> : null}
          <span>{item}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={() => {
        setCreateSplitViewOpened(true);
      }}
    >
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <Pill.Group>
            {values}
            <ActionIcon>
              <IconSearch size={14} />
            </ActionIcon>
            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                variant="filled"
                placeholder="Find issues"
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
              <SplitView
                opened={createSplitViewOpened}
                setOpened={setCreateSplitViewOpened}
              />
            </Combobox.EventsTarget>

          </Pill.Group>

        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? options : <Combobox.Empty>Nothing found...</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
