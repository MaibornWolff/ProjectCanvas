import { Select, Tooltip, Box } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { Issue, IssueType } from "types";

export function EpicSelect({
  form,
  enabled,
  issueTypes,
  issueTypesWithFieldsMap,
  isLoading,
}: {
  form: UseFormReturnType<Issue>,
  enabled: boolean,
  issueTypes?: IssueType[],
  issueTypesWithFieldsMap?: Map<string, string[]>,

  isLoading: boolean,
}) {
  const { data: epics } = useQuery({
    queryKey: ["epics", form.getInputProps("projectKey").value],
    queryFn: () => window.provider.getEpicsByProject(form.getInputProps("projectKey").value!),
    enabled: enabled && !!form.getInputProps("projectKey").value,
  });

  const isDisabled = issueTypesWithFieldsMap
    && issueTypesWithFieldsMap.size > 0
    && (!issueTypesWithFieldsMap
      .get(form.getInputProps("type").value)
      ?.includes("Sprint")
      || form.getInputProps("type").value
        === issueTypes?.find((issueType) => issueType.name === "Epic")?.id);

  return (
    <Tooltip
      label={
        form.getInputProps("type").value === ""
          ? "Please select an issue type first"
          : "Epic cannot be selected for this issue type"
      }
      position="top-start"
      events={{
        hover: isDisabled ?? false,
        focus: false,
        touch: false,
      }}
    >
      <Box>
        <Select
          label="Epic"
          placeholder="Choose epic"
          nothingFoundMessage={
            epics && epics.length > 0
              ? "Please select an issue type first"
              : "No epics found"
          }
          disabled={isDisabled}
          data={
            !isLoading && epics
              ? epics.map((epic) => ({
                value: epic.issueKey,
                label: epic.summary,
              }))
              : []
          }
          searchable
          clearable
          {...form.getInputProps("epic.issueKey")}
        />
      </Box>
    </Tooltip>
  );
}
