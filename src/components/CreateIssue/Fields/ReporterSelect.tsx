import { Select } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { Issue, User } from "types"
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
        !isLoading && assignableUsers
          ? assignableUsers.map((assignableUser) => ({
              image: assignableUser.avatarUrls["24x24"],
              value: assignableUser.id,
              label: assignableUser.displayName,
            }))
          : []
      }
      required
      searchable
      withinPortal
      {...form.getInputProps("reporter")}
      value={ form.getInputProps("reporter").value?.id }
      onChange={(value) => {
        form.getInputProps("reporter").onChange(assignableUsers?.find((user) => user.id === value))
      }}
    />
  )
}
