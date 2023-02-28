import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, User } from "project-extender"
import { SelectItem } from "../SelectItem"

export function ReporterSelect({
  form,
  currentUser,
  assignableUsers,
  isLoading,
}: {
  form: UseFormReturnType<Issue>
  currentUser?: User
  assignableUsers?: User[]
  isLoading: boolean
}) {
  return (
    <Select
      label="Reporter"
      placeholder={currentUser?.displayName || "Select a Reporter"}
      nothingFound="No Options"
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
