import { Combobox, ComboboxProps, InputBase, useCombobox, CloseButton, InputBaseProps } from "@mantine/core";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";

export function CustomItemSelect<
  OptionType extends { value: string, label: string },
  RefType,
>({
  value,
  onChange,
  options,
  ItemComponent,
  clearable,
  searchable,
  label,
  placeholder,
  nothingFoundMessage,
  comboboxProps = {},
  inputBaseProps = {},
}: {
  value?: string,
  onChange: (updatedValue: string | undefined) => void,
  options: OptionType[],
  ItemComponent: ForwardRefExoticComponent<OptionType & RefAttributes<RefType>>,
  clearable?: boolean,
  searchable?: boolean,
  label?: string,
  placeholder?: string,
  nothingFoundMessage?: string,
  comboboxProps?: ComboboxProps,
  inputBaseProps?: Omit<InputBaseProps, "value">,
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [currentValue, setCurrentValue] = useState<string | null>(
    value ?? null,
  );
  const selectedOption = options.find((item) => item.value === currentValue);
  const [search, setSearch] = useState(
    selectedOption ? selectedOption.label : "",
  );

  const activeSearch = searchable && options.every((item) => item.label !== search);
  const filteredOptions = activeSearch
    ? options.filter(
      (item) => item.value.toLowerCase().includes(search.toLowerCase().trim())
          || item.label.toLowerCase().includes(search.toLowerCase().trim()),
    )
    : options;

  const items = filteredOptions.length > 0 ? (
    filteredOptions.map((item) => (
      <Combobox.Option value={item.value} key={item.value}>
        <ItemComponent {...item} />
      </Combobox.Option>
    ))
  ) : (
    <Combobox.Empty>{nothingFoundMessage}</Combobox.Empty>
  );

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setCurrentValue(val);
        const newSelectedOption = options.find((item) => item.value === val);
        setSearch(newSelectedOption ? newSelectedOption.label : "");
        combobox.closeDropdown();
        onChange(val);
      }}
      {...comboboxProps}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          value={search}
          placeholder={placeholder}
          pointer
          rightSection={
            clearable && currentValue !== null ? (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setCurrentValue(null);
                  setSearch("");
                  combobox.closeDropdown();
                  onChange(undefined);
                }}
                aria-label="Clear value"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          onChange={(event) => {
            combobox.openDropdown();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(selectedOption ? selectedOption.label : "");
          }}
          rightSectionPointerEvents={currentValue === null ? "none" : "all"}
          {...inputBaseProps}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{items}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
