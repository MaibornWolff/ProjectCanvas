import { MultiSelect } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { Issue } from "types";
import { getLabels } from "../queryFunctions";

export function LabelsSelect({ form }: { form: UseFormReturnType<Issue> }) {
  const { data: labels } = useQuery({
    queryKey: ["labels"],
    queryFn: () => getLabels(),
  });

  return (
    <MultiSelect
      label="Labels"
      placeholder="Choose labels"
      nothingFoundMessage="No Options"
      data={labels ?? []}
      searchable
      clearable
      {...form.getInputProps("labels")}
    />
  );
}
