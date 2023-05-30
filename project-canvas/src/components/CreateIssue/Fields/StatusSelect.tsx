import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, IssueType } from "types"

export function StatusSelect({
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
      label="Status"
      placeholder="Choose status"
      withinPortal
      searchable
      nothingFound={
        form.getInputProps("type").value === ""
          ? "Please select an issue type first"
          : "No Options"
      }
      data={
        !isLoading && issueTypes && issueTypes instanceof Array
          ? issueTypes
              .find(
                (issueType) => issueType.id === form.getInputProps("type").value
              )
              ?.statuses?.map((status) => status.name) || []
          : []
      }
      {...form.getInputProps("status")}
    />
  )
}
