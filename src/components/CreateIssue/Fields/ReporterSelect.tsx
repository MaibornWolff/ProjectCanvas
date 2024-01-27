import { UseFormReturnType } from "@mantine/form";
import { Issue, User } from "types";
import { SelectItem } from "../SelectItem";
import { CustomItemSelect } from "../../common/CustomItemSelect";

export function ReporterSelect({
  form,
  assignableUsers,
  isLoading,
}: {
  form: UseFormReturnType<Issue>,
  assignableUsers?: User[],
  isLoading: boolean,
}) {
  return (
    <CustomItemSelect
      label="Reporter"
      placeholder="Choose reporter"
      nothingFoundMessage="Please select a project first"
      searchable
      options={
        !isLoading && assignableUsers
          ? assignableUsers.map((assignableUser) => ({
            image: assignableUser.avatarUrls["24x24"],
            value: assignableUser.id,
            label: assignableUser.displayName,
          }))
          : []
      }
      ItemComponent={SelectItem}
      inputBaseProps={{ required: true }}
      {...form.getInputProps("reporter")}
      value={form.getInputProps("reporter").value?.id}
      onChange={(value) => {
        form
          .getInputProps("reporter")
          .onChange(assignableUsers?.find((user) => user.id === value));
      }}
    />
  );
}
