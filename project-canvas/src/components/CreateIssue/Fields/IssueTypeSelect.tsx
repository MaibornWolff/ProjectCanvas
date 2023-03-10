import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, IssueType } from "project-extender"

export function IssueTypeSelect({
  form,
  issueTypes,
  isLoading,
}: {
  form: UseFormReturnType<Issue>
  issueTypes?: IssueType[]
  isLoading: boolean
}) {
  return (
    <Select
      label="Issue Type"
      placeholder="Story"
      nothingFound="No Options"
      data={
        !isLoading && issueTypes && issueTypes instanceof Array
          ? issueTypes
              .filter((issueType) => issueType.name !== "Subtask")
              .map((issueType) => ({
                value: issueType.id,
                label: issueType.name,
              }))
          : []
      }
      required
      {...form.getInputProps("type")}
      onChange={(value) => {
        form.getInputProps("type").onChange(value)
        if (
          issueTypes?.find((issueType) => issueType.name === "Epic")?.id ===
          value
        ) {
          form.setFieldValue("sprintId", null as unknown as string)
          form.setFieldValue("storyPointsEstimate", null as unknown as number)
          form.setFieldValue("epic", null as unknown as string)
        }
        form.setFieldValue("status", "To Do")
        form.setFieldValue("priority.id", null)
        form.setFieldValue("startDate", null as unknown as Date)
        form.setFieldValue("dueDate", null as unknown as Date)
      }}
    />
  )
}
