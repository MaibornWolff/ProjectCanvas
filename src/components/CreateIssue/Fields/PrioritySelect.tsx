import { Box, Tooltip } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { Issue } from "types";
import { getPriorities } from "../queryFunctions";
import { SelectItem } from "../SelectItem";
import { CustomItemSelect } from "../../common/CustomItemSelect";

export function PrioritySelect({
  form,
  issueTypesWithFieldsMap,
  isLoading,
}: {
  form: UseFormReturnType<Issue>,
  issueTypesWithFieldsMap?: Map<string, string[]>,
  isLoading: boolean,
}) {
  const { data: priorities } = useQuery({
    queryKey: ["priorities"],
    queryFn: () => getPriorities(),
  });

  const isDisabled = issueTypesWithFieldsMap
    && issueTypesWithFieldsMap.size > 0
    && !issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Priority");

  return (
    <Tooltip
      label={
        form.getInputProps("type").value === ""
          ? "Please select an issue type first"
          : "Priority cannot be selected for this issue type"
      }
      position="top-start"
      events={{
        hover: isDisabled ?? false,
        focus: false,
        touch: false,
      }}
    >
      <Box>
        <CustomItemSelect
          label="Priority"
          placeholder="Choose priority"
          nothingFoundMessage="Please select an issue type first"
          clearable
          searchable
          options={
            !isLoading && priorities
              ? priorities.map((priority) => ({
                image: priority.iconUrl,
                value: priority.id,
                label: priority.name,
              }))
              : []
          }
          ItemComponent={SelectItem}
          inputBaseProps={{ disabled: isDisabled }}
          {...form.getInputProps("priority.id")}
        />
      </Box>
    </Tooltip>
  );
}
