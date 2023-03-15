import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, Project, User } from "project-extender"

export function ProjectSelect({
  form,
  projects,
  currentUser,
}: {
  form: UseFormReturnType<Issue>
  projects: Project[]
  currentUser?: User
}) {
  return (
    <Select
      label="Project"
      placeholder="Choose project"
      nothingFound="No Options"
      data={projects.map((project) => ({
        value: project.id?.toString() || "",
        label: `${project.name} (${project.key})`,
      }))}
      searchable
      required
      {...form.getInputProps("projectId")}
      onChange={(value) => {
        form.getInputProps("projectId").onChange(value)
        form.setFieldValue("type", "")
        form.setFieldValue("status", "")
        form.setFieldValue("assignee.id", null)
        form.setFieldValue(
          "reporter",
          currentUser?.accountId || (null as unknown as string)
        )
      }}
    />
  )
}
