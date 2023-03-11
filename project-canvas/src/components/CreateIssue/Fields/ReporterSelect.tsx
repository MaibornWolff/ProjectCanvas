import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, User } from "project-extender"
import { SelectItem } from "../SelectItem"

export function ReporterSelect({
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
      label="Reporter"
      placeholder="Choose reporter"
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
      required
      searchable
      {...form.getInputProps("reporter")}
    />
  )
}
