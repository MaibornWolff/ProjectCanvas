import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, User } from "project-extender"
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
      nothingFound="Please select a project first"
      itemComponent={SelectItem}
      data={
        !isLoading && assignableUsers && assignableUsers instanceof Array
          ? assignableUsers.map((assignableUser) => ({
              image: assignableUser.avatarUrls["24x24"],
              value: assignableUser.accountId,
              label: assignableUser.displayName,
            }))
          : []
      }
      clearable
      searchable
      {...form.getInputProps("assignee.id")}
    />
  )
}
