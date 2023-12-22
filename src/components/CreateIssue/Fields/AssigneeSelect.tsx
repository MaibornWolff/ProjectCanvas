import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, User } from "types"
import { SelectItem } from "../SelectItem"

export function AssigneeSelect({
  form,
  assignableUsers,
  isLoading,
}: {
  form: UseFormReturnType<Issue>
  assignableUsers?: User[]
  isLoading: boolean
}) {
  return (
    <Select
      label="Assignee"
      placeholder="Choose assignee"
      nothingFoundMessage="Please select a project first"
      itemComponent={SelectItem}
      data={
        !isLoading && assignableUsers
          ? assignableUsers.map((assignableUser) => ({
              image: assignableUser.avatarUrls["24x24"],
              value: assignableUser.id,
              label: assignableUser.displayName,
            }))
          : []
      }
      clearable
      searchable
      {...form.getInputProps("assignee")}
      value={ form.getInputProps("assignee").value?.id }
      onChange={(value) => {
        form.getInputProps("assignee").onChange(assignableUsers?.find((user) => user.id === value))
      }}
    />
  )
}
