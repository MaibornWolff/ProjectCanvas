import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, IssueType } from "types"

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
      placeholder="Choose issue type"
      nothingFound="Please select a project first"
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
      withinPortal
      searchable
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
          form.setFieldValue("epic.issueKey", undefined)
        }
        form.setFieldValue("status", "To Do")
        form.setFieldValue("priority.id", null)
        form.setFieldValue("startDate", null as unknown as Date)
        form.setFieldValue("dueDate", null as unknown as Date)
      }}
    />
  )
}
