import { Select } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { Issue, Project, User } from "types";

export function ProjectSelect({
  form,
  projects,
  currentUser,
}: {
  form: UseFormReturnType<Issue>,
  projects: Project[],
  currentUser?: User,
}) {
  return (
    <Select
      label="Project"
      placeholder="Choose project"
      nothingFoundMessage="No Options"
      data={projects.map((project) => ({
        value: project.key?.toString() || "",
        label: `${project.name} (${project.key})`,
      }))}
      searchable
      required
      {...form.getInputProps("projectKey")}
      onChange={(value) => {
        form.getInputProps("projectKey").onChange(value);
        form.setFieldValue("type", "");
        form.setFieldValue("status", "");
        form.setFieldValue("assignee", undefined);
        if (currentUser) {
          form.setFieldValue("reporter", currentUser);
        }
      }}
    />
  );
}
